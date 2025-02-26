let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = [];
let oldestWeapon = 0;

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const buttonReset = document.querySelector("#btnReset");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const monsterLevelText = document.querySelector("#monsterLevel");

const weapons =[
    {
        name: "Stick",
        damage: 2,
        sellVal: 1,
        description: "A sturdy stick. It won't break easily but probably not the best of weapons."
    }
    ,
    {
        name: "Dagger",
        damage: 15,
        sellVal: 5,
        description: "A small rusty dagger. Nothing special but it will do the job."
    }
    ,
    {
        name: "Sword",
        damage: 30,
        sellVal: 10,
        description: "A simple iron sword. This would hurt a lot for sure."
    }
    ,
    {
        name: "Bow and arrows",
        damage: 60,
        sellVal: 20,
        description: "A simple recurved bow and some arrows. Careful planning can yield good results."
    }
]

const monsters =[
    {
        name: "Slime",
        health: 30,
        lvl: 2,
        description: "A big green gooey blob that jumps up and down mindlessly."
    }
    ,
    {
        name: "Fanged Beast",
        health: 120,
        lvl: 12,
        description: "A monstorus best resembling a wolf with black fangs that have a faint blue chilling aura around them." 
    }
    ,
    {
        name: "Dragon",
        health: 700,
        lvl: 30,
        description: "A black dragon with red wings that span 10 meters each. Its yellow eyes seem to hold incredible power." 
    }
]

const locations = [
    {
        name : "town square",
        "button text" : ["Go to Store", "Go to Cave", "Fight Dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You've returned to the Town Square with the \"Store\" sign behind you. In the distance you see a cave entrance in the mountains. \nWhat's the next action?"
    }
    ,
    {
        name : "town store",
        "button text" : ["Buy 10 Health (10 Gold)", "Buy New Weapon (30 Gold)", "Go to Town Square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You've entered the Store, what do you want to do?"
    }
    ,
    {
        name: "cave",
        "button text":["Fight Slime", "Fight Fanged Beast", "Go to Town Square"],
        "button functions":[fightSlime, fightBeast, goTown],
        text: "You enter a putrid cave full of goo and horrid odors, you see some enemies guarding various treasures. \nWhat is your action?"
    }
    ,
    {
        name: "fight",
        "button text":["Attack", "Dodge", "Run"],
        "button functions":[attack, dodge, run],
        text: "You are fightning a monster."
    }
];

//Initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;
buttonReset.onclick = gameReset;
inventory.push(weapons[0].name);

function update(location){
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];

    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];

    text.innerText = location.text;
}

function goTown(){
    update(locations[0]);
 } 

function goStore(){
    update(locations[1]);
}

function goCave(){
    update(locations[2]);
}

function buyHealth(){
    updateHealth(+10, false);
    updateGold(-10);
}

function buyWeapon(){
    if(currentWeapon < weapons.length - 1){
        if(gold >= 20){
            updateGold(-30);
            currentWeapon++;
            let newWeapon = weapons[currentWeapon];
            inventory.push(newWeapon.name)

            text.innerText = "You have purchased a new weapon:\n< " + newWeapon.name +" > \n[" + newWeapon.description + "]";
            text.innerText += "\n\n Your Inventory now contains: [ " + inventory +" ]";

        }else{
            text.innerText = "You don't have money to buy a weapon.";
            if(gold <= -20){
                text.innerText += "\nYou have debt with the owner. They expect to be paid when you earn gold."
            } 
        }
    }else{
        text.innerText = "You've purchased all the available weapons. The store has nothing new to offer. You can sell your older weapons."; 
        button2.innerText = "Sell " + weapons[oldestWeapon].name +" for " + weapons[oldestWeapon].sellVal +" gold";
        button2.onclick = sellWeapon;
    }
    
}

function updateGold(changeValue){
    if(gold+changeValue >= -20){
        gold += changeValue;
        goldText.innerText = gold;
        if(gold < 0)
            goldText.innerText += " (Debt)";
    }else{
        text.innerText = "Can't purchase anymore, too much debt with the Store owner.\nThey expect to be paid back when you earn some money";
    }
}

function updateHealth(changeValue, inCombat){
    if(gold >= -10 && !inCombat){
        health += changeValue;
        healthText.innerText = health;
        text.innerText = "Health Strengthening Potion purchased."
    }
    if(inCombat){
        health += changeValue;
        healthText.innerText = health;
        text.innerText += "You sustained " + changeValue +" points of damage.\n";
    }
}

function sellWeapon(){
    if(inventory.length > 1){
        updateGold(weapons[oldestWeapon].sellVal);
        let soldWeapon = inventory.shift();
        text.innerText = "You sold: " + soldWeapon +".\nYour inventory contains: [ " + inventory + " ]";
        oldestWeapon++;

        if(oldestWeapon < currentWeapon){
            button2.innerText = "Sell " + weapons[oldestWeapon].name +" for " + weapons[oldestWeapon].sellVal +" gold";
        }else{
            button2.innerText = "No Weapon to Buy/Sell";
        }
    }else{
        text.innerText = "You cannot sell your only weapon! What will you fight monsters with?\nFists? Even the Slimes would kill you."
    }
}

function fightSlime(){
    fighting = 0;
    startFight();
}

function fightBeast(){
    fighting = 1;
    startFight();
}

function fightDragon(){
    fighting = 2;
    startFight();
}

function startFight(){
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
    monsterLevelText.innerText = monsters[fighting].lvl;
}

function attack(){
    let currentMonster = monsters[fighting];
    let playerWeaponDamage = weapons[currentWeapon].damage + Math.floor(Math.random() * (xp));

    text.innerText = "The " + currentMonster.name +" attacks.\n";
    text.innerText += "You attack it with your "+weapons[currentWeapon].name+"\n";

    if((Math.random() <= 0.10) && (inventory.length !== 1) && xp < 50){
        text.innerText = "Your "+ inventory.pop() + " breaks";
        currentWeapon--;
    }else{
        if(isMonsterHit()){
            updateHealth(-getMonsterAttackValue(currentMonster.lvl), true);
            text.innerText += "You deal " +playerWeaponDamage + " points of dmg.";
            monsterHealth -= playerWeaponDamage;
            monsterHealthText.innerText = monsterHealth;
        }else{
            text.innerText = "You Missed."
        }
    }
    
    if(health <= 0){
        lose();
    }else if(monsterHealth <= 0){
        return (fighting === 2) ? winGame() : defeatMonster();
    }
}

function dodge(){
    text.innerText = "You dodged the attack from " + monsters[fighting].name + " .";
}

function run(){
    monsterStats.style.display = "none";
    update(locations[0]);
}

function exitCombat(){
    monsterStats.style.display = "none";
    button1.style.display = "";
    button2.style.display = "";
    update(locations[2]);
}

function getMonsterAttackValue(monsterLvl){
    let hit = (monsterLvl * 5) - (Math.floor(Math.random() * xp));
    hit = hit > 0 ? hit : 0;
    return hit;
}

function isMonsterHit(){
    let currentMonster = monsters[fighting];
    return (Math.random() * (xp + 1)) > (0.2 * currentMonster.lvl * Math.random()) || currentMonster.health < 10;
}

function defeatMonster() {
    let currentMonster = monsters[fighting];
    let goldGained = Math.round(currentMonster.lvl * 6.7);
    let xpGained = Math.round(currentMonster.lvl*0.95);
    gold += goldGained;
    xp += xpGained;
    xpText.innerText = xp;
    goldText.innerText = gold;
    button1.style.display = "none";
    button2.style.display = "none";
    button3.innerText = "Ok";
    button3.onclick = exitCombat;
    text.innerText = "You have defeated the " + currentMonster.name + ". You receive " + goldGained + " gold and "+ xpGained + " experience.";
}

function winGame(){
    text.innerText = "Dragon Defeated!\nThe town people will forever be grateful to you.\n To commemorate this event they even made a statue of you with your "+ weapons[currentWeapon].name +" in hand."
    button1.style.display = "none";
    button2.style.display = "none";
    button3.innerText = "Ok";
    button3.onclick = gameReset;
}

function lose(){
    if(monsterHealth <= 0){
        text.innerText = "The " + monsters[fighting].name +" killed you as you dealt it the final blow. You Died.\nRestart Game?";
    }else{
        text.innerText = "The " + monsters[fighting].name + " got the better of you. You Died.\nRestart Game?"
    }
    
    button1.style.display = "none";
    button2.style.display = "none";
    button3.innerText = "Ok";
    button3.onclick = gameReset;
}

function gameReset(){
    location.reload(true);
}