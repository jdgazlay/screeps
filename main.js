/*
TODO - container mining needs to be a thing.
*/

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleAttack = require('role.attack');
var roleFixer = require('role.fixer'); //patch for temporary fixer time instead of building. Trying to build up my trump walls before I start getting invaded by other people.
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');
var roleHealer = require('role.healer');
var tower = require('tower');

module.exports.loop = function () {
    PathFinder.use(true);

    //constant creeps needed counts
    var HARVESTER_NEEDED = 3;
    var BUILDER_NEEDED = 2;
    var UPGRADER_NEEDED = 4;
    var FIXER_NEEDED = 3;
    var MINER_NEEDED = 0;
    var CARRIER_NEEDED = 0;
    var ATTACKER_NEEDED = 0;
    var CLAIMER_NEEDED = 0;
    var HEALER_NEEDED = 0;


    //count how many harvesters, builders, and upgraders we have on the field at the moment and build more if needed.
    var harvesterCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builderCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraderCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var fixerCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'fixer');
    var minerCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    var carrierCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
    var attackerCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
    var claimerCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
    var healerCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');

    var HARVESTER_BODY;

    // put in some disaster detection for if there are 0 creeps and we don't have enemies, then start rebuildling the base again
    if (_.size(Game.creeps) < 1 || undefined) {
      if (Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS) < 1 || undefined) {
        HARVESTER_BODY = [MOVE, MOVE, WORK, CARRY, CARRY];
      }
    } else {
      HARVESTER_BODY = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
    }

    //Constants for the bodies of each creep. makes it easy to change in one place
    var BUILDER_BODY = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
    var UPGRADER_BODY = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
    var FIXER_BODY = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
    var MINER_BODY = [WORK, WORK, WORK, WORK, WORK, MOVE];
    var CARRIER_BODY = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    var ATTACKER_BODY = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK];
    var CLAIMER_BODY = [CLAIM, CLAIM, MOVE, MOVE];
    var HEALER_BODY = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, HEAL, MOVE, MOVE, HEAL, MOVE, MOVE, HEAL, MOVE, MOVE, HEAL]

    //Garbage collection (basically)
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            var oldRole = Memory.creeps[name].role;
            delete Memory.creeps[name];
            console.log('May '+name+' the '+oldRole+' rest in peace');
        }
    }

    //If we have less harvesters than we need and we have more than half the builders and a fifth the upgraders we need, then create a harvester.
    if (harvesterCount.length < HARVESTER_NEEDED && (harvesterCount.length < (HARVESTER_NEEDED/2) || (builderCount.length > (BUILDER_NEEDED/2) && upgraderCount.length > (UPGRADER_NEEDED/5)))) {

        var newName = Game.spawns['Spawn1'].createCreep(HARVESTER_BODY, undefined, {role: 'harvester', assignedRoom: 'W58S46'});

        if (newName != ERR_NOT_ENOUGH_ENERGY && newName != ERR_BUSY) {
            console.log('Welcome '+newName+' the harvester to the floor');
        }


    }

    // if we didn't need harvesters more than builders and we don't need upgraders more than builders than we'll create a builder.
    else if (builderCount.length < BUILDER_NEEDED && upgraderCount.length > (UPGRADER_NEEDED/5)) {

        var newName = Game.spawns['Spawn1'].createCreep(BUILDER_BODY, undefined, {role: 'builder', assingedRoom: 'W58S46'});
        if (newName != ERR_NOT_ENOUGH_ENERGY && newName != ERR_BUSY) {
            console.log('Welcome '+newName+' the builder to the floor');
        }

    }

    //finally, if we didn't need harvesters or builders and we need upgraders, than we'll create our upgrader here.
    else if (upgraderCount.length < UPGRADER_NEEDED) {

        var newName = Game.spawns['Spawn1'].createCreep(UPGRADER_BODY, undefined, {role: 'upgrader', assingedRoom: 'W58S46'});
        if (newName != ERR_NOT_ENOUGH_ENERGY && newName != ERR_BUSY) {
            console.log('Welcome '+newName+' the upgrader to the floor');
        }

    }
    //finally, if we didn't need harvesters or builders and we need upgraders, than we'll create our upgrader here.
    else if (fixerCount.length < FIXER_NEEDED) {

        var newName = Game.spawns['Spawn1'].createCreep(FIXER_BODY, undefined, {role: 'fixer', assingedRoom: 'W58S46'});
        if (newName != ERR_NOT_ENOUGH_ENERGY && newName != ERR_BUSY) {
            console.log('Welcome '+newName+' the fixer to the floor');
        }

    }
    else if (attackerCount.length < ATTACKER_NEEDED) {

        var newName = Game.spawns['Spawn1'].createCreep(ATTACKER_BODY, undefined, {role: 'attacker', assingedRoom: 'W57S46', attacking: false});
        if (newName != ERR_NOT_ENOUGH_ENERGY && newName != ERR_BUSY) {
            console.log('Welcome '+newName+' the attacker to the floor');
        }

    }
    else if (healerCount.length < HEALER_NEEDED) {

        var newName = Game.spawns['Spawn1'].createCreep(HEALER_BODY, undefined, {role: 'healer', assingedRoom: 'W57S46'});
        if (newName != ERR_NOT_ENOUGH_ENERGY && newName != ERR_BUSY) {
            console.log('Welcome '+newName+' the healer to the floor');
        }

    }
    else if (minerCount.length < MINER_NEEDED) {

        var newName = Game.spawns['Spawn1'].createCreep(MINER_BODY, undefined, {role: 'miner', assingedRoom: 'W57S46'});
        if (newName != ERR_NOT_ENOUGH_ENERGY && newName != ERR_BUSY) {
            console.log('Welcome '+newName+' the miner to the floor');
        }

    }
    else if (carrierCount.length < CARRIER_NEEDED) {

        var newName = Game.spawns['Spawn1'].createCreep(CARRIER_BODY, undefined, {role: 'carrier', assingedRoom: 'W57S46'});
        if (newName != ERR_NOT_ENOUGH_ENERGY && newName != ERR_BUSY) {
            console.log('Welcome '+newName+' the carrier to the floor');
        }

    }
    else if (claimerCount.length < CLAIMER_NEEDED /*&& (Game.rooms['W57S46'].controller.reservation.ticksToEnd <= 4000 || Game.flags.room2ControllerFlag.room == undefined)*/) {

        var newName = Game.spawns['Spawn1'].createCreep(CLAIMER_BODY, undefined, {role: 'claimer', assingedRoom: 'W57S46'});
        if (newName != ERR_NOT_ENOUGH_ENERGY && newName != ERR_BUSY) {
            console.log('Welcome '+newName+' the claimer to the floor');
        }

    }

    var towers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER, my: true}});
    towers.forEach(tower.run);

    //for every creep on the floor of the game we loop through their roles and decide what module to send them to. I'm also having them say goodbye if this is their final tick.
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.ticksToLive <= 2) {
            creep.say('bye T_T');
            if (creep.ticksToLive == 1) {
                if (creep.getActiveBodyparts(CARRY) >= 1) {
                  creep.drop(RESOURCE_ENERGY);
                  creep.suicide();
                }
            }
        }

        if (creep.memory.role == 'attacker') {
            roleAttack.run(creep);
        }
        if (creep.memory.role == 'healer') {
          roleHealer.run(creep);
        }
        //var isHostileInRoom = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        //if (isHostileInRoom) {
        //    roleHarvester.run(creep);
        //}
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') { //temp routing all builders to fixers and inside of the fixer module it is re-routing them to builder if there is nothing to fix.

            roleBuilder.run(creep);
            //roleFixer.run(creep);
        }
        if(creep.memory.role == 'fixer') {
            roleFixer.run(creep);
        }
        if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if (creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
        }
        if (creep.memory.role == 'claimer') {
            if (!Memory.paths.spawn1ToW57S46) {
                var start = Game.spawns['Spawn1'].pos;
                var end = new RoomPosition(48, 32, 'W58S46'/*Game.spawns['Spawn1'].room.name*/);
                Memory.paths.spawn1ToW57S46 = Game.spawns['Spawn1'].room.findPath(start, end, {ignoreCreeps: true, serialize: true});
            }
            if (!Memory.paths.room2W58S46ToController && Game.flags.room2ControllerFlag.room != undefined) {
                var start = new RoomPosition(1, 32, 'W57S46');
                var end = Game.flags.room2ControllerFlag.pos;
                Memory.paths.room2W58S46ToController = Game.rooms['W57S46'].findPath(start, end, {ignoreCreeps: true, serialize: true});
            }

            /*if (creep.room != Game.flags.room2ControllerFlag.pos) {
                var journey = Room.deserializePath(Memory.paths.spawn1ToW57S46);
                if (creep.memory._move.path != journey) {
                    creep.moveByPath(journey);
                }
            } else {
                var journey = Room.deserializePath(Memory.paths.room2W58S46ToController);
                if (creep.memory._move.path != journey && creep.pos != Game.flags.room2ControllerFlag.pos) {
                    creep.moveByPath(journey);
                } else {
                    creep.reserveController(creep.room.controller);
                }
            }*/

            if (creep.pos != Game.flags.room2ControllerFlag.pos) {

                creep.moveTo(Game.flags.room2ControllerFlag, {ignoreCreeps: true});

            }
                creep.reserveController(creep.room.controller);
        }

    }
    //console.log(Game.cpu.getUsed());
};
