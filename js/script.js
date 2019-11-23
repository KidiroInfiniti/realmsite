var Example = Example || {};

Example.doublePendulum = function() {
    var Engine = Matter.Engine,
        Events = Matter.Events,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Vector = Matter.Vector;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var lampCanvas = document.getElementById("lamp");
    var render = Render.create({
        canvas: lampCanvas,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: '#f000'
        }
    });

    //Resize Event Listner
    function resizeCanvas(){
      lampCanvas.width = window.innerWidth;
      lampCanvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas, false);

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    var group = Body.nextGroup(true),
        length = 200,
        width = 15,
        radius = 90;

    var pendulum = Composites.stack(1545, -10, 2, 1, -20, 0, function(x, y, i) {
        if(i==0)
        {
          return Bodies.rectangle(x, y, length, width, {
             collisionFilter: { group: group },
             frictionAir: .1,
             chamfer: 5,
             render: {fillStyle: 'black', lineWidth: 1}
          });
        }
        else
        {
          var rr = {sprite:{
            texture: 'assets/HomePageLamp.png',
            xScale: 0.8,
            yScale: 0.8,
            xOffset: -0.36
          }};
          return Bodies.circle(x, y, radius, {
             collisionFilter: { group: group },
             frictionAir: .1,
             chamfer: 5,
             render: rr //{fillStyle: 'black', lineWidth: 1}
          });
        }



    });

    pendulum.bodies[0].render.strokeStyle = '#4a485b';
    pendulum.bodies[1].render.strokeStyle = '#4a485b';

    world.gravity.scale = 0.010;

    Composites.chain(pendulum, 0.45, 0, -0.45, 0, {
        stiffness: 0.9,
        length: 0,
        angularStiffness: 0.7,
        render: {
            strokeStyle: 'black'
        }
    });

    Composite.add(pendulum, Constraint.create({
        bodyB: pendulum.bodies[0],
        pointB: { x: -length * 0.42, y: 0 },
        pointA: { x: pendulum.bodies[0].position.x - length * 0.42, y: pendulum.bodies[0].position.y },
        stiffness: 0.9,
        length: 0,
        render: {
            strokeStyle: 'black'
        }
    }));

    var lowerArm = pendulum.bodies[1];

    Body.rotate(lowerArm, -Math.PI * 0.3, {
        x: lowerArm.position.x - 100,
        y: lowerArm.position.y
    });

    World.add(world, pendulum);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 1920, y: 1080 }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};

if (typeof module !== 'undefined') {
    module.exports = Example[Object.keys(Example)[0]];
}
Example.doublePendulum();
