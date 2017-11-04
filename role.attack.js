/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.attack');
 * mod.thing == 'a thing'; // true
 */
var roleAttacker = {

    run: function (creep) {

        if (creep.memory.attacking == false) {
          if (Game.flags.room2SourceFlag.room == undefined) { //undefined means we can't see the room
              creep.moveTo(Game.flags.room2GuardPost); //so we move to the flag that's in the room
          }
          else { // if it's not undefined, then we can see the room, so we'll move to the energy source*/
              var enemies = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
              if (!enemies) {
                  creep.moveTo(Game.flags.room2GuardPost);
              } else {
                  if (creep.attack(enemies) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(enemies);
                  }
              }
          }
        } else {
          if (Game.flags.AttackFlag1.room == undefined) {
              creep.moveTo(Game.flags.AttackFlag1);
          } else {
            var enemies = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (!enemies) {
              var struct = Game.flags.AttackFlag1.room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_TOWER || s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_EXTRACTOR || s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_LINK || s.structureType == STRUCTURE_SPAWN) && s.my == false});
              if (struct.length) {
                  if (creep.attack(struct[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(struct[0]);
                  }
              } else {
                creep.moveTo(Game.flags.AttackFlag1);
              }
            } else {
              if (creep.attack(enemies) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemies);
              }
            }
          }
        }
    }

};

module.exports = roleAttacker;
