



class ECS {

  constructor() {
    this.entities = []; // an array of ints
    this.entityBitmasks = []; // and array of 32-bit integers (bitmasks)
    this.components = new Map();
    this.systems = [];
    this.nextEntityId = 0;
  }

  registerSystem(constructor) {
    const system = new constructor();
    this.systems.push(constructor, system);
    this.systems.sort((a, b) => a.priority - b.priority);
  }

  // App possible component types must be registered before the game starts
  registerComponent(constructor) {
    const component = new constructor();
    // assign a unique bitmask based on the number of components already registered
    component.bitmask = 1 << this.components.size;
    this.components.set(constructor, component);
  }

  createEntity() {
    const id = this.nextEntityId;
    this.entities.push(id);
    this.entityBitmasks[id] = 0; // empty bitmask, no components
    this.nextEntityId ++;
    return new EntityComponentAdder(id, this);
  }

  addComponentToEntity(entity, constructor, data) {
    const component = this.components.get(constructor).bitmask;
    this.entityBitmasks[entity] |= component;
  }

  removeComponentFromEntity(entity, constructor) {
    const mask = this.components.get(constructor).bitmask;
    this.entityBitmasks[entity] &= ~mask;
  }

  search(components) {
    const searchMask = components.reduce((mask, component) => mask | this.components.get(component).bitmask, 0);

    return this.entities.filter((entity) => {
      return (this.entityBitmasks[entity] & searchMask) === searchMask;
    })
  }

}

class EntityComponentAdder {
  constructor(id, ecs) {
    this.id = id;
    this.ecs = ecs;
  }
  addComponent(constructor, data) {
    this.ecs.addComponentToEntity(this.id, constructor, data);
    return this;
  }
}


class Position {
  constructor(x, y) {
    this.x_s = [];
    this.y_s = [];
    this.bitmask = null;
  }
  update(entityId, {x, y}) {
  }
}

class Velocity {
  constructor(x, y) {
    this.xv_s = [];
    this.yv_s = [];
    this.bitmask = null;
  }
  update(entityId, {x, y}) {
  }
}
class Displayable {
  constructor(x, y) {
    this.xv_s = [];
    this.yv_s = [];
    this.bitmask = null;
  }
  update(entityId, {x, y}) {
  }
}

class MovementSystem{
  constructor() {
    this.priority = 1;
  }
}
class DisplaySystem{
  constructor() {
    this.priority = 10;
  }
}



const ecs = new ECS();

ecs.registerSystem(MovementSystem);
ecs.registerSystem(DisplaySystem);

ecs.registerComponent(Position);
ecs.registerComponent(Velocity);
ecs.registerComponent(Displayable);

ecs.createEntity()
  .addComponent(Position, {x: 0, y: 0})
  .addComponent(Displayable).id

ecs.createEntity()
  .addComponent(Position, {x: 0, y: 0})
  .addComponent(Velocity, {xv: 0, yv: 0})
  .addComponent(Displayable).id

const entities = ecs.search([Position, Displayable]);
console.log(entities);