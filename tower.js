var tower = {

  run: function (tower) {

    // keep walls, ramparts, & roads from breaking
    const WALL_HITS_MIN = 10;
    const RAMPART_HITS_MIN = 10;
    const ROAD_HITS_MIN = 10;

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

    if (!closestHostile) {
        var closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (creep) => creep.hits < creep.hitsMax});
        if (!closestDamagedCreep) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => (structure.structureType == STRUCTURE_ROAD && structure.hits < (ROAD_HITS_MIN)) || (structure.structureType == STRUCTURE_WALL && structure.hits < WALL_HITS_MIN) || (structure.structureType == STRUCTURE_RAMPART && structure.hits < RAMPART_HITS_MIN) || (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax)});
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure); //repair things if there's no enemies in the room
            }
        } else {
            tower.heal(closestDamagedCreep);
        }
    } else {

        var damagedCreepClosestToEnemy = closestHostile.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (creep) => (creep.hits <= (creep.hitsMax * .5) && (creep.getActiveBodyparts(ATTACK) >= 1 || creep.getActiveBodyparts(RANGED_ATTACK) >= 1)) || creep.hits <= (creep.hitsMax * .2)});
        if (damagedCreepClosestToEnemy) { //if there's a creep fighting, lets heal him

            tower.heal(damagedCreepClosestToEnemy);

        } else {
            tower.attack(closestHostile);
        }

    }
  }
};

module.exports = tower;
