var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');

	    }

        if(creep.memory.building) {

            //if we're building, try to build extensions first (only currently).
	        var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: (structure) => structure.structureType == STRUCTURE_EXTENSION});

	        //if there were no extention construction sites, then build walls, and if that doesn't exist, build anything else that does.
	        if (!targets) {

	            var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: (structure) => structure.structureType == STRUCTURE_RAMPART || structure.structureType == STRUCTURE_TOWER});
	            if (!targets) {
	                var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
	            }

	        }

	        //check to see if anything was selected and then start building away!
            if(targets) {
                if(creep.build(targets) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                }
            }
            else {
                roleUpgrader.run(creep);//return false;
            }
	    }
	    else {

	        var sources = creep.room.find(FIND_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_STORAGE /*|| s.structureType == STRUCTURE_CONTAINER*/) && s.store[RESOURCE_ENERGY] > 0});
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

module.exports = roleBuilder;
