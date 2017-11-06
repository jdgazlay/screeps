/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.healer');
 * mod.thing == 'a thing'; // true
 */

var roleHealer = {
  run: function (creep) {
      var force = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');

      if (force.length) {

        var needMedic = _.filter(force, (creep) => creep.hits < creep.hitsMax);
        if (needMedic.length) {
          creep.moveTo(needMedic[0]);

          var closeHeal = null;
          var rangeHeal = null;

          for (var i = 0; i < needMedic.length; i++) {
            if (creep.pos.inRangeTo(needMedic[i], 1) && !closeHeal) {
              if ((creep.hits/creep.hitsMax) < (needMedic[i].hits /needMedic[i].hitsMax)) {
                closeHeal = creep;
                creep.heal(creep);
              } else {
                closeHeal = needMedic[i];
                creep.heal(needMedic[i]);
              }
            } else if (creep.pos.inRangeTo(needMedic[i], 3) && !rangeHeal && closeHeal != needMedic[i]) {
              rangeHeal = needMedic[i];
              creep.rangedHeal(needMedic[i]);
            }
          }
        } else {
          if (force[force.length - 1].room == creep.room) {
            creep.moveTo(force[force.length - 1]);
          } else {
            creep.moveTo(force[0]);
          }

        }

        /*if (force[0].hits < force[0].hitsMax && creep.pos.inRangeTo(force[0], 1)) {

            creep.heal(force[0]);
            if (force[1].hits < force[1].hitsMax && creep.pos.inRangeTo(force[1], 3)) {
                creep.rangedHeal(force[1]);
            }

        } else if (force[1].hits < force[1].hitsMax && creep.pos.inRangeTo(force[1], 1)) {
            creep.heal(force[1]);
            if (force[0].hits < force[0].hitsMax && creep.pos.inRangeTo(force[0], 3)) {
                creep.rangedHeal(force[0]);
            }
        }*/

      } else {
        creep.moveTo(Game.flags.room2GuardPost);
      }

  }
};

module.exports = roleHealer;
