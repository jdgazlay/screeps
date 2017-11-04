/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.fixer');
 * mod.thing == 'a thing'; // true
 */

var roleUpgrader = require('role.upgrader');

var roleFixer = {

    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('fixing');
	    }

        if(creep.memory.building) {

            //if we're fixing, find the things that need to be fixed
	        var closestDamagedWall = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => (structure.hits <= (structure.hitsMax*.5) && structure.structureType == STRUCTURE_ROAD) || (structure.hits <= 300000 && structure.structureType == STRUCTURE_RAMPART)});
            if (closestDamagedWall) {
                if (creep.repair(closestDamagedWall) == ERR_NOT_IN_RANGE) {

                    creep.moveTo(closestDamagedWall);

                }
            }
            else {

                roleUpgrader.run(creep);

            }
	    }
	    else {
	        var sources = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0});
          if (sources.length) {
            if(creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
          } else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
              creep.moveTo(sources[0]);
            }
          }
	    }

    }
};

module.exports = roleFixer;
