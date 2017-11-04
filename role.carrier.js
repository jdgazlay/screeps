/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.carrier');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = require('role.harvester');

var roleCarrier = {
    run: function(creep) {

        if (!creep.memory.fetching && creep.carry.energy == 0) {
            creep.memory.fetching = true;
            creep.say('Pickin up');
        }
        if (creep.memory.fetching && creep.carry.energy == creep.carryCapacity) {
            creep.memory.fetching = false;
            creep.say('Droppin off');
        }

        if (creep.memory.fetching) { //if we're fetching

            if (Game.flags.room2SourceFlag.room == undefined) { //undefined means we can't see the room
                creep.moveTo(Game.flags.room2SourceFlag); //so we move to the flag and room
            }
            else { // if it's not undefined, then we can see the room, so we'll move to the energy source
                var droppedEnergy = Game.flags.room2SourceFlag.room.find(FIND_DROPPED_ENERGY);
                var closestDroppedEnergy = creep.room.find(FIND_DROPPED_ENERGY)[0];
                if (creep.pos.isNearTo(closestDroppedEnergy)) { // as we move, pickup any energy that is near us.
                    creep.pickup(closestDroppedEnergy);
                }
                if (droppedEnergy.length) {
                  if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {

                          creep.moveTo(droppedEnergy[0]);

                  }
                } else {
                  creep.moveTo(Game.flags.room2SourceFlag);
                }
            }


        }
        else { //if we're dropping off become a harvester (drop the energy off to extensions and towers.)
            roleHarvester.run(creep);
        }
    }
};


module.exports = roleCarrier;
