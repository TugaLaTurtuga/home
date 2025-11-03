// --- Entity definitions ---
let _entities = [
  {
    name: "Rock",
    color: [128, 128, 128],
    winsTo: [2],
    attractedToSame: false,
    amount: 10,
    id: 0,
  },
  {
    name: "Paper",
    color: [255, 255, 255],
    winsTo: [0],
    attractedToSame: false,
    amount: 10,
    id: 1,
  },
  {
    name: "Scissors",
    color: [255, 0, 0],
    winsTo: [1],
    attractedToSame: false,
    amount: 10,
    id: 2,
  },
  {
    name: "Lizard",
    color: [0, 255, 0],
    winsTo: [1, 4], // beats Paper & Spock
    attractedToSame: false,
    amount: 10,
    id: 3,
  },
  {
    name: "Spock",
    color: [0, 0, 255],
    winsTo: [0, 2], // beats Rock & Scissors
    attractedToSame: false,
    amount: 10,
    id: 4,
  },
  {
    name: "Fire",
    color: [255, 120, 0],
    winsTo: [1, 3], // burns Paper & Lizard
    attractedToSame: false,
    amount: 10,
    id: 5,
  },
  {
    name: "Water",
    color: [0, 150, 255],
    winsTo: [5, 0], // extinguishes Fire, erodes Rock
    attractedToSame: false,
    amount: 10,
    id: 6,
  },
  {
    name: "Plant",
    color: [50, 200, 50],
    winsTo: [6, 0], // absorbs Water, cracks Rock
    attractedToSame: false,
    amount: 10,
    id: 7,
  },
  {
    name: "Metal",
    color: [192, 192, 192],
    border: [128, 128, 64],
    borderSize: 1,
    winsTo: [7, 5], // cuts Plant, resists Fire
    attractedToSame: false,
    amount: 10,
    id: 8,
  },
  {
    name: "Electric",
    color: [255, 255, 0],
    winsTo: [6, 7], // shocks Water & Plant
    attractedToSame: false,
    amount: 10,
    id: 9,
  },
];

// --- Special non-RPS entities ---
let _specialEntities = [
  {
    name: "Black Hole",
    color: [0, 0, 0],
    border: [128, 50, 0],
    winsTo: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    damping: 0.5,
    sizeMultiplier: 5,
    massMultiplier: 1,
    amount: 2,
    id: 0,
  },
  {
    name: "White Hole",
    color: [255, 255, 255],
    border: [200, 200, 255],
    specialWinsTo: [0, 1, 2, 3, 4, 5],
    damping: 0.995,
    sizeMultiplier: 5,
    massMultiplier: 1,
    amount: 2,
    atractedToSame: false,
    id: 1,
  },
  {
    name: "Time Anomaly",
    color: [100, 0, 150],
    border: [200, 100, 255],
    winsTo: [5, 6, 7], // warps Fire, Water, Plant
    damping: 0.3,
    sizeMultiplier: 3,
    massMultiplier: 0.8,
    amount: 2,
    id: 2,
  },
  {
    name: "Void Entity",
    color: [20, 20, 40],
    border: [80, 0, 120],
    winsTo: [0, 2, 8, 9], // consumes Rock, Scissors, Metal, Electric
    damping: 0.6,
    sizeMultiplier: 4,
    massMultiplier: 2,
    amount: 2,
    id: 3,
  },
  {
    name: "Quantum Core",
    color: [0, 255, 255],
    border: [0, 100, 255],
    winsTo: [2, 4, 9], // scissors, spock, electric
    damping: 0.4,
    sizeMultiplier: 2.5,
    massMultiplier: 0.5,
    amount: 2,
    id: 4,
  },
  {
    name: "Entropy Field",
    color: [255, 0, 255],
    border: [80, 0, 80],
    winsTo: [1, 5, 7, 8], // disrupts Paper, Fire, Plant, Metal
    damping: 0.7,
    sizeMultiplier: 4,
    massMultiplier: 1.2,
    amount: 2,
    id: 5,
  },
];


function addEntity(place, entity, amount, isSpecial = false) {
  if (!place || !place.entities || !place.specialEntities) return;

  let choosenEntity = null;
  if (!isSpecial) {
    if (typeof entity == 'string') {
      let entityID = -1
      for (let i = 0; i < _entities.length; i++) {
        if (entity.trim().toLowerCase() === _entities[i].name.trim().toLowerCase()) {
          entityID = i;
          break;
        }
      }
      if (entityID !== -1) {
        choosenEntity = { ..._entities[entityID] };
      }
    } else {
      choosenEntity = { ..._entities[entity] };
    }
    
    choosenEntity.amount = amount;
    place.entities.push(choosenEntity);
  } else {
    if (typeof entity == 'string') {
      let entityID = -1
      for (let i = 0; i < _specialEntities.length; i++) {
        if (entity.trim().toLowerCase() === _specialEntities[i].name.trim().toLowerCase()) {
          entityID = i;
          break;
        }
      }
      if (entityID !== -1) {
        choosenEntity = { ..._specialEntities[entityID] };
      }
    } else {
      choosenEntity = { ..._specialEntities[entity] };
    }
    
    choosenEntity.amount = amount;
    place.specialEntities.push(choosenEntity);
  }
}

function junctionEntities(places = []) {
  entities = [];
  specialEntities = [];

  for (let i = 0; i < _entities.length; i++) {
    entities.push(null);
  }

  for (let i = 0; i < _specialEntities.length; i++) {
    specialEntities.push(null);
  }

  for (let i = 0; i < places.length; i++) {
    let place = places[i];
    let placeEntities = place.entities;
    let placeSpecialEntities = place.specialEntities;

    for (let j = 0; j < placeEntities.length; j++) {
      let placeEntity = placeEntities[j];
      let peID = placeEntity.id;

      if (!entities[peID] || typeof entities[peID] !== 'object') {
        entities[peID] = { ...placeEntity };
      } else {
        entities[peID].amount += placeEntity.amount;
      }
    }

    for (let j = 0; j < placeSpecialEntities.length; j++) {
      let placeSpecialEntity = placeSpecialEntities[j];
      let peID = placeSpecialEntity.id;

      if (!specialEntities[peID] || typeof specialEntities[peID] !== 'object') {
        specialEntities[peID] = { ...placeSpecialEntity };
      } else {
        specialEntities[peID].amount += placeSpecialEntity.amount;
      }
    }
  }
}


function addRamdomEntities(place) {
  if (!place || !place.entities || !place.specialEntities) return;

  let entitiesToAdd =        Math.max(3, Math.floor(Math.random() * _entities.length) );
  let specialEntitiesToAdd = Math.max(3, Math.floor(Math.random() * _specialEntities.length) );

  for (let i = 0; i < entitiesToAdd; i++) {
    let randomEntityID = Math.floor(Math.random() * _entities.length);
    let randomAmount = Math.floor(Math.random() * 100);

    let entityPlace = -1;
    for (let j = 0; j < place.entities.length; j++) {
      let id = place.entities[j].id;

      if (id === randomEntityID) {
        entityPlace = j;
        break;
      }
    }

    if (entityPlace !== -1) {
      place.entities[entityPlace].amount += randomAmount;
    } else {
      let entity = { ..._entities[randomEntityID] };
      entity.amount = randomAmount;
      place.entities.push(entity);
    }
  }

  for (let i = 0; i < specialEntitiesToAdd; i++) {
    let randomEntityID = Math.floor(Math.random() * _specialEntities.length);
    let randomAmount = Math.floor(Math.random() * 10);

    let entityPlace = -1;
    for (let j = 0; j < place.specialEntities.length; j++) {
      let id = place.specialEntities[j].id;

      if (id === randomEntityID) {
        entityPlace = j;
        break;
      }
    }

    if (entityPlace !== -1) {
      place.specialEntities[entityPlace].amount += randomAmount;
    } else {
      let entity =  { ..._specialEntities[randomEntityID] };
      entity.amount = randomAmount;
      place.specialEntities.push(entity);
    }
  }
}
