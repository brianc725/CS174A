window.Cube = window.classes.Cube =
class Cube extends Shape                 // Here's a complete, working example of a Shape subclass.  It is a blueprint for a cube.
  { constructor()
      { super( "positions", "normals" ); // Name the values we'll define per each vertex.  They'll have positions and normals.

        // First, specify the vertex positions -- just a bunch of points that exist at the corners of an imaginary cube.
        this.positions.push( ...Vec.cast( [-1,-1,-1], [1,-1,-1], [-1,-1,1], [1,-1,1], [1,1,-1],  [-1,1,-1],  [1,1,1],  [-1,1,1],
                                          [-1,-1,-1], [-1,-1,1], [-1,1,-1], [-1,1,1], [1,-1,1],  [1,-1,-1],  [1,1,1],  [1,1,-1],
                                          [-1,-1,1],  [1,-1,1],  [-1,1,1],  [1,1,1], [1,-1,-1], [-1,-1,-1], [1,1,-1], [-1,1,-1] ) );
        // Supply vectors that point away from eace face of the cube.  They should match up with the points in the above list
        // Normal vectors are needed so the graphics engine can know if the shape is pointed at light or not, and color it accordingly.
        this.normals.push(   ...Vec.cast( [0,-1,0], [0,-1,0], [0,-1,0], [0,-1,0], [0,1,0], [0,1,0], [0,1,0], [0,1,0], [-1,0,0], [-1,0,0],
                                          [-1,0,0], [-1,0,0], [1,0,0],  [1,0,0],  [1,0,0], [1,0,0], [0,0,1], [0,0,1], [0,0,1],   [0,0,1],
                                          [0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1] ) );

                 // Those two lists, positions and normals, fully describe the "vertices".  What's the "i"th vertex?  Simply the combined
                 // data you get if you look up index "i" of both lists above -- a position and a normal vector, together.  Now let's
                 // tell it how to connect vertex entries into triangles.  Every three indices in this list makes one triangle:
        this.indices.push( 0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
                          14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22 );
        // It stinks to manage arrays this big.  Later we'll show code that generates these same cube vertices more automatically.
      }
  }

window.Transforms_Sandbox = window.classes.Transforms_Sandbox =
class Transforms_Sandbox extends Tutorial_Animation   // This subclass of some other Scene overrides the display() function.  By only
{ display( graphics_state )                           // exposing that one function, which draws everything, this creates a very small code
                                                      // sandbox for editing a simple scene, and for experimenting with matrix transforms.
    { let model_transform = Mat4.identity();      // Variable model_transform will be a temporary matrix that helps us draw most shapes.
                                                  // It starts over as the identity every single frame - coordinate axes at the origin.
      graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
      /**********************************
      Start coding down here!!!!
      **********************************/         // From here on down it's just some example shapes drawn for you -- freely replace them
                                                  // with your own!  Notice the usage of the functions translation(), scale(), and rotation()
                                                  // to generate matrices, and the functions times(), which generates products of matrices.

      const blue = Color.of( 0,0,1,1 ), yellow = Color.of( 1,1,0,1 );
      model_transform = model_transform.times( Mat4.translation([ 0, -4, 20 ]) );
      this.shapes.box.draw( graphics_state, model_transform.times(Mat4.scale([10,1,1])), this.plastic.override({ color: yellow }) );   // Draw the top box.

//        const t = this.t = graphics_state.animation_time/1000;     // Find how much time has passed in seconds, and use that to place shapes.

      model_transform = model_transform.times( Mat4.translation([ 0, 2, 0 ]) );  // Tweak our coordinate system downward for the next shape.
      this.shapes.ball.draw( graphics_state, model_transform, this.plastic.override({ color: blue }) );    // Draw the ball.

      for (let i = 0; i < 50; i++) {
        model_transform = model_transform.times(Mat4.translation([0, 1.9, 0]));
        model_transform = model_transform.times(Mat4.scale([.9,.9,.9]));
        this.shapes.ball.draw( graphics_state, model_transform, this.plastic.override({ color: blue }) );    // Draw the ball.
      }


//       if( !this.hover )     // The first line below won't execute if the button on the page has been toggled:
//         model_transform = model_transform.times( Mat4.rotation( t, Vec.of( 0,1,0 ) ) )  // Spin our coordinate frame as a function of time.
//       model_transform   = model_transform.times( Mat4.rotation( 1, Vec.of( 0,0,1 ) ) )  // Rotate another axis by a constant value.
//                                          .times( Mat4.scale      ([ 1,   2, 1 ]) )      // Stretch the coordinate frame.
//                                          .times( Mat4.translation([ 0,-1.5, 0 ]) );     // Translate down enough for the two volumes to miss.
//       this.shapes.box.draw( graphics_state, model_transform, this.plastic.override({ color: yellow }) );   // Draw the bottom box.
    }
}

window.Cube_Outline = window.classes.Cube_Outline =
class Cube_Outline extends Shape
  { constructor()
      { super( "positions", "colors" ); // Name the values we'll define per each vertex.

        //  TODO (Requirement 5).
                                // When a set of lines is used in graphics, you should think of the list entries as
                                // broken down into pairs; each pair of vertices will be drawn as a line segment.

        // First, specify the edge pairs, starting with the bottom, then the top, then the back, and then the front
        this.positions.push( ...Vec.cast( [-1,-1,-1], [1,-1,-1], [-1,-1,1], [1,-1,1], [1,1,-1],  [-1,1,-1],  [1,1,1],  [-1,1,1],
                                          [-1,-1,-1], [-1,-1,1], [-1,1,-1], [-1,1,1], [1,-1,1],  [1,-1,-1],  [1,1,1],  [1,1,-1],
                                          [-1,-1,1],  [1,-1,1],  [-1,1,1],  [1,1,1], [1,-1,-1], [-1,-1,-1], [1,1,-1], [-1,1,-1],
                                          [-1,-1,-1], [-1, 1,-1], [1,-1,-1], [1,1,-1], [-1,-1,1], [-1,1,1], [1,-1,1], [1,1,1] ) );

        // get the white color 
        let white_color = Color.of(1,1,1,1);

        // for each pair give it the color white
        for (let i = 0; i < this.positions.length; i=i+1){
          this.colors.push( ... Vec.cast(white_color));
        }

        this.indexed = false;       // Do this so we won't need to define "this.indices".
      }
  }

window.Cube_Single_Strip = window.classes.Cube_Single_Strip =
class Cube_Single_Strip extends Shape
  { constructor()
      { super( "positions", "normals" );

        // TODO (Extra credit part I)
        this.positions.push( ...Vec.cast( [-1,-1,-1], [1,-1,-1], [-1,-1,1], [1,-1,1],
                                          [-1,1,-1], [1,1,-1], [-1,1,1], [1, 1, 1] ) );

        this.normals.push( ...Vec.cast( [-1,-1,-1], [1,-1,-1], [-1,-1,1], [1,-1,1],
                                          [-1,1,-1], [1,1,-1], [-1,1,1], [1, 1, 1] ) );

        this.indices.push( 0, 1, 2, 3, 7, 1,5, 0, 4,7,6,2);
//         this.indices.push(0,1,2,3,1,7,5,6,4,2,0,1,4,5);
      }
  }

window.Assignment_One_Scene = window.classes.Assignment_One_Scene =
class Assignment_One_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   )
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) );

        const r = context.width/context.height;
        context.globals.graphics_state.    camera_transform = Mat4.translation([ 5,-10,-30 ]);  // Locate the camera here (inverted matrix).
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        const shapes = { 'box': new Cube(),               // At the beginning of our program, load one of each of these shape
                       'strip': new Cube_Single_Strip(),  // definitions onto the GPU.  NOTE:  Only do this ONCE per shape
                     'outline': new Cube_Outline() }      // design.  Once you've told the GPU what the design of a cube is,
        this.submit_shapes( context, shapes );            // it would be redundant to tell it again.  You should just re-use
                                                          // the one called "box" more than once in display() to draw
                                                          // multiple cubes.  Don't define more than one blueprint for the
                                                          // same thing here.

                                     // Make some Material objects available to you:
        this.clay   = context.get_instance( Phong_Shader ).material( Color.of( .9,.5,.9, 1 ), { ambient: .4, diffusivity: .4 } );
        this.white  = context.get_instance( Basic_Shader ).material();
        this.plastic = this.clay.override({ specularity: .6 });

        this.lights = [ new Light( Vec.of( 0,5,5,1 ), Color.of( 1, .4, 1, 1 ), 100000 ) ];
        
        this.set_colors();
        this.still_flag = false; //initialize still flag 
        this.outline_flag = false;
      }
    set_colors() {
          // TODO:  Create a class member variable to store your cube's colors.
          this.colorArray1 = [Color.of(0.2667, 0.6745, 0.8117,1), Color.of(0.0902, 0.6902, 0.0706,1), Color.of(0.9412, 0.5961, 0.2549,1), Color.of(0.6039, 0.0941, 0.7294,1),
                              Color.of(0.5686, 1, 0.9569,1), Color.of(1, 0.6, 0.6431,1), Color.of(0.9176, 1, 0,1), Color.of(0.2039, 0.0902, 0.6118,1)];
          this.colorArray2 = [Color.of(1, 0.2549, 0.8627,1), Color.of(1, 0.9216, 0.0863,1), Color.of(0.9883, 0.3059, 0.9764,1), Color.of(0.4941, 0.7882, 0.6863,1),
                              Color.of(0.8667, 0.7176, 0.1098,1), Color.of(0.8667, 0.1098, 0.4902,1), Color.of(0.2667, 0.6745, 0.8117,1), Color.of(0.7490, 0.8275, 0.9372,1)];
          this.colorArray3 = [Color.of(0.5686, 1, 0.9569,1), Color.of(1, 0.9216, 0.0863,1), Color.of(0.4441, 0.3333, 0.0863,1), Color.of(0.9182, 0.1111, 0.2222,1),
                              Color.of(0.3332, 1, 1,1), Color.of(0.1142, 0.1424, 0.9901,1), Color.of(0.7155, 0.2234, 0.0863,1), Color.of(.2322, 0.4216, 0.7863,1)]

          // initialize a color switch variable, rotate through the arrays every time set_colors is clicked
          if (!this.colorSwitch) { 
            this.colorSwitch = 1;
          }
          else if (this.colorSwitch == 1) {
            this.colorSwitch = 2;
          }
          else if (this.colorSwitch == 2) {
            this.colorSwitch = 3;
          }
          else if (this.colorSwitch == 3) {
            this.colorSwitch = 1;
          }
          
      }
    make_control_panel()             // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      { this.key_triggered_button( "Change Colors", [ "c" ], this.set_colors );    // Add a button for controlling the scene.
        this.key_triggered_button( "Outline",       [ "o" ], () => {

          // TODO:  Requirement 5b:  Set a flag here that will toggle your outline on and off
          this.outline_flag = !this.outline_flag;
          } );
        this.key_triggered_button( "Sit still",     [ "m" ], () => {

          // TODO:  Requirement 3d:  Set a flag here that will toggle your swaying motion on and off.
          this.still_flag = !this.still_flag;
         
          } );
      }
    draw_box( graphics_state, model_transform, colors, box_num )
      {
        // TODO:  Helper function for requirement 3 (see hint).
        //        This should make changes to the model_transform matrix, draw the next box, and return the newest model_transform.
        let t; 
        if (!this.still_flag) {
          t = this.t = graphics_state.animation_time/1000;     // Find how much time has passed in seconds     
        }
        else {
          t = this.t = 1/12; // this is when sin is 1 so we get maximal angle (since it will be sin of pi/2)
        }

        // translate the center of cube to the top right corner of lower cube
        // rotate the cube at f = 3 Hz, 0.06283*2 = .04* pi and by adding 0.06283 we ensure it does not go below 0
        // translate center back -1 in x and up 1 more time 
        model_transform = model_transform = model_transform.times( Mat4.translation([1,1.5, 0])).times(Mat4.rotation(0.06283+ 0.06283*(Math.sin(2*Math.PI*3*t)), Vec.of( 0,0,-1 ))).times( Mat4.translation([-1, 1.5, 0])); //Draw boxes going upwards
    
         if (!this.outline_flag) {
           this.shapes.box.draw( graphics_state, model_transform.times(Mat4.scale([1,1.5,1])), this.plastic.override({ color: colors[box_num] }) ); 
         }
         else {
           this.shapes.outline.draw(graphics_state, model_transform.times(Mat4.scale([1,1.5,1])), this.white, "LINES" )
         }

        return model_transform;
      }
    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.      

        let model_transform = Mat4.identity();
        let colors = [];

        //choose the corresponding color array given by switch number
        if (this.colorSwitch == 0 || this.colorSwitch == 1) {
          colors = this.colorArray1;
        }
        else if (this.colorSwitch == 2) {
          colors = this.colorArray2;
        }
        else if (this.colorSwitch == 3) {
          colors = this.colorArray3;
        }

        // TODO:  Draw your entire scene here.  Use this.draw_box( graphics_state, model_transform ) to call your helper.
        model_transform = model_transform.times( Mat4.translation([ 0, 0, 0 ]) );
//         this.shapes.box.draw( graphics_state, model_transform.times(Mat4.scale([1,1.5,1])), this.plastic.override({ color: colors[0] }) );   // Draw the bottom box.
        this.shapes.strip.draw(graphics_state,model_transform.times(Mat4.scale([1,1.5,1])), this.plastic.override({ color: colors[0] }), "TRIANGLE_STRIP");

        for (let i = 1; i < 8; i++) {
          model_transform = this.draw_box(graphics_state, model_transform, colors, i); //call draw box function and save transform value for next build up
        } 
      }
  }
