/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.miner');
 * mod.thing == 'a thing'; // true

Need to turn the miner into a healer for battle. everyone works. Everyone fights. Everyone dies.

 */
var roleMiner = {
    run: function(creep) {
        //currently only 1 miner for room 2's energy source.

        if (Game.flags.room2SourceFlag.room == undefined) { //undefined means we can't see the room
            creep.moveTo(Game.flags.room2SourceFlag); //so we move to the flag and room
        }
        else { // if it's not undefined, then we can see the room, so we'll move to the energy source
            var room2Source = Game.flags.room2SourceFlag.room.find(FIND_SOURCES);
            if (creep.harvest(room2Source[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(room2Source[0]);
            }
        }
    }
};

module.exports = roleMiner;
