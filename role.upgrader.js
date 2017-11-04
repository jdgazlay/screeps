var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('upgrading');
	    }

	    if(creep.memory.upgrading) {
	        if (!Memory.room1Source0ToController) {
	            var start = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
	            var end = Game.spawns['Spawn1'].room.controller;
	            var path = Game.spawns['Spawn1'].room.findPath(start[0].pos, end.pos, {ignoreCreeps: true});
	            Memory.room1Source0ToController = Room.serializePath(path);
	        }
	        if (Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity) {
	            if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(Game.spawns['Spawn1']);
	            }
	        }
            else {
                if (creep.upgradeController(Game.spawns['Spawn1'].room.controller) == ERR_NOT_IN_RANGE) {
                    /*var path = Room.deserializePath(Memory.room1Source0ToController);
                    creep.moveByPath(path);*/
                    creep.moveTo(Game.spawns['Spawn1'].room.controller, {ignoreCreeps: true});
                }
                else {
                    if (creep.room.lookForAt(LOOK_CREEPS, creep.pos.x, creep.pos.y - 1).length) {
                        creep.move(BOTTOM);
                    }
                }
            }


        }
        else {

            var closestDroppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES)[0];

            if (creep.pos.isNearTo(closestDroppedEnergy)) { // as we move, pickup any energy that is near us.
                creep.pickup(closestDroppedEnergy);
            }

            var sources = creep.room.find(FIND_SOURCES);

            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }

        }
	}
};

module.exports = roleUpgrader;
