var roleFixer = require('role.fixer');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

    //if there are enemy hostile creeps around then we'll fight in the shade.
    var enemies = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

    if (!enemies || creep.memory.role == 'carrier') {

        if (!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
            creep.say('harvesting');
        }
        if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('transfer');
        }

	    if(creep.memory.harvesting) {



            var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
            if (sources[1].energy == 0 && sources[1].ticksToRegeneration >= 20) {



                    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                    }

                    var closestDroppedEnergy = creep.room.find(FIND_DROPPED_ENERGY)[0];
                    if (creep.pos.isNearTo(closestDroppedEnergy)) { // as we move, pickup any energy that is near us.
                        creep.pickup(closestDroppedEnergy);
                    }

            }
            else {

                if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1]);
                }

                var closestDroppedEnergy = creep.room.find(FIND_DROPPED_ENERGY)[0];

                if (creep.pos.isNearTo(closestDroppedEnergy)) { // as we move, pickup any energy that is near us.
                    creep.pickup(closestDroppedEnergy);
                }
            }

        }
        else {

            var targets = Game.spawns['Spawn1'].room.find(FIND_SOURCES)[1].pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_EXTENSION &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if (!targets) {
                var targets = Game.spawns['Spawn1'].room.find(FIND_SOURCES)[1].pos.findClosestByRange(FIND_STRUCTURES, {
                  filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER /*|| structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE*/) &&
                    (structure.energy < structure.energyCapacity /*|| _.sum(structure.store) < structure.storeCapacity*/)}});

                if (!targets) {
                  var targets = Game.spawns['Spawn1'].room.find(FIND_SOURCES)[1].pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                      return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && (_.sum(structure.store) < structure.storeCapacity)}});

                }

            }

            //If we found targets to transfer the energy to, then we'll transfer the energy (we are harvesters after all).
            if(targets) {

                if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                }
            }

            //If we can't transfer to anyone because they're all full, then we'll shift to building with the materials we have.
            else {

                if (creep.memory.role == 'carrier') {
                    //roleUpgrader.run(creep);

                        var closestHarvester = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (creep) => (creep.memory.role == 'harvester' || creep.memory.role == 'builder' || creep.memory.role == 'upgrader') && creep.carry.energy < creep.carryCapacity});
                        if (closestHarvester) {
                            if (creep.transfer(closestHarvester, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(closestHarvester);
                            }
                        }



                } else {
                    roleBuilder.run(creep);
                }



            }
        }

    } else {
        if (creep.rangedAttack(enemies) == ERR_NOT_IN_RANGE) {
            if (creep.room != 'W58S46') {
                var backHome = new RoomPosition(31, 46, 'W58S46');
                creep.moveTo(backHome);
            } else {
              if (creep.room.lookForAtArea(LOOK_CREEPS, 8, 25, 11, 29, {filter: (creep) => creep.my == false})) {
                  creep.moveTo(26, 12);
              } else {
                  creep.moveTo(31, 46);
              }
            }
        }
    }
	}
	
};

module.exports = roleHarvester;
