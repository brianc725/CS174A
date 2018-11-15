window.Assignment_Two_Test = window.classes.Assignment_Two_Test =
class Assignment_Two_Test extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
        this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        const shapes = { torus:  new Torus( 15, 15 ),
                         torus2: new ( Torus.prototype.make_flat_shaded_version() )( 15, 15 ),
 
                                // TODO:  Fill in as many additional shape instances as needed in this key/value table.
                                //        (Requirement 1)

                          sphere_subdiv1: new ( Subdivision_Sphere.prototype.make_flat_shaded_version() )(1), // sphere with 1 subdivisions 
                          sphere_subdiv2: new ( Subdivision_Sphere.prototype.make_flat_shaded_version() )(2), // sphere with 2 subdivisions 
                          sphere_subdiv3: new Subdivision_Sphere(3), // sphere with 3 subdivisions       
                          sphere_subdiv4: new Subdivision_Sphere(4), // sphere with 4 subdivisions 
                          grid_sphere: new ( Grid_Sphere.prototype.make_flat_shaded_version() )(15, 15)
                       }
        this.submit_shapes( context, shapes );
                                     
                                     // Make some Material objects available to you:
        this.materials =
          { test:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient:.2 } ),
            ring:     context.get_instance( Ring_Shader  ).material(),

                                // TODO:  Fill in as many additional material objects as needed in this key/value table.
                                //        (Requirement 1)  
             maxAmb: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1 } ), //maximum ambience
             diffOnly: context.get_instance( Phong_Shader ).material(Color.of(1,1,0,1), {diffusivity: 1, specularity: 0 }), // diffuse only
             planet2Gouraud: context.get_instance( Phong_Shader ).material(Color.of(1,1,0,1), {diffusivity: .2, specularity: 1, gouraud:1}),
             planet2Smooth: context.get_instance( Phong_Shader ).material(Color.of(1,1,0,1), {diffusivity: .2, specularity: 1}),
             planet3: context.get_instance( Phong_Shader ).material(Color.of(1,1,0,1), {diffusivity: 1, specularity: 1}),
             planet4: context.get_instance( Phong_Shader ).material(Color.of(1,1,0,1), {specularity:1}),
             planet5: context.get_instance( Phong_Shader ).material(Color.of(1,1,0,1), {specularity:1, diffusivity:1})
          }

        this.lights = [ /* new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ), */ new Light( Vec.of(0,0,0,1), Color.of(0,0,1,1), 10**1)  ];
      }
    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      { this.key_triggered_button( "View solar system",  [ "0" ], () => this.attached = () => this.initial_camera_location );
        this.new_line();
        this.key_triggered_button( "Attach to planet 1", [ "1" ], () => this.attached = () => this.planet_1 );
        this.key_triggered_button( "Attach to planet 2", [ "2" ], () => this.attached = () => this.planet_2 ); this.new_line();
        this.key_triggered_button( "Attach to planet 3", [ "3" ], () => this.attached = () => this.planet_3 );
        this.key_triggered_button( "Attach to planet 4", [ "4" ], () => this.attached = () => this.planet_4 ); this.new_line();
        this.key_triggered_button( "Attach to planet 5", [ "5" ], () => this.attached = () => this.planet_5 );
        this.key_triggered_button( "Attach to moon",     [ "m" ], () => this.attached = () => this.moon     );
      }
    display( graphics_state )
      { 
        // camera modification
        // make sure this.attached not undefined
        if (this.attached != undefined){
          // get attached value, translate back 5 units
          let desired_view = this.attached().times(Mat4.translation([0,0,5]));
          // invert because it is a camera
          desired_view = Mat4.inverse(desired_view);
         // graphics_state.camera_transform = Mat4.inverse(desired_view); 
          let blending_factor = 0.1;
          graphics_state.camera_transform = desired_view.map( (x,i) => Vec.from( graphics_state.camera_transform[i] ).mix(x, blending_factor));
        }
       
        // remove the first element from lights, add new value
        this.lights.splice(0,1); 
        this.lights.push(new Light (Vec.of(0,0,0,1), Color.of(this.redValue, 0, this.blueValue, 1), 10**this.sunRadius));     

        graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;  

        // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 2 and 3)
        // this.shapes.torus2.draw( graphics_state, Mat4.identity(), this.materials.test );

        // draw the sun at origin
        let model_transform = Mat4.identity();
        let sunRadius = this.sunRadius = 2+Math.sin(2*Math.PI*(1/5)*t-(Math.PI/2)); // goes from radius 1 to 3 over time of 5 seconds
        // blue --> red
        let blueValue = this.blueValue = 0.5+0.5*Math.sin(2*Math.PI*(1/5)*t-((3*Math.PI)/2)); // blue starts at 1, goes to 0
        let redValue =  this.redValue = 0.5+0.5*Math.sin(2*Math.PI*(1/5)*t-(Math.PI/2)); // red starts at 0, goes to 1
        this.shapes.sphere_subdiv4.draw(graphics_state, model_transform.times(Mat4.scale([sunRadius, sunRadius, sunRadius])), 
                                                          this.materials.maxAmb.override({color: Color.of(redValue,0,blueValue,1) }));

        // Planet 1
        model_transform = model_transform.times(Mat4.rotation(t, Vec.of(0,1,0))); //rotate the planets around sun
        model_transform = model_transform.times(Mat4.translation([5,0,0]));
        this.shapes.sphere_subdiv2.draw(graphics_state, model_transform.times(Mat4.rotation(6*t,Vec.of(0,1,0))), this.materials.diffOnly.override({color: Color.of(0.5490, 0.60784, 0.8706, 1)}));
        this.planet_1 = model_transform.times(Mat4.rotation(6*t,Vec.of(0,1,0))); //store in class variable
  
        // Planet 2
        // translate back to the sun, rotate there, translate back
        model_transform = model_transform.times(Mat4.translation([-5,0,0]));
        model_transform = model_transform.times(Mat4.rotation(-0.2*t, Vec.of(0,1,0))); //rotate the planets around sun
        model_transform = model_transform.times(Mat4.translation([8,0,0]));
        if (Math.floor(t)%2 == 1) {
          // odd second so Gouraud shading
          this.shapes.sphere_subdiv3.draw(graphics_state, model_transform.times(Mat4.rotation(2.5*t, Vec.of(0,1,0))), this.materials.planet2Gouraud.override({color: Color.of(0.0745, 0.38824, 0.0745,1)}));
        }
        else {
          //even shading so regular smooth shading
          this.shapes.sphere_subdiv3.draw(graphics_state, model_transform.times(Mat4.rotation(2.5*t, Vec.of(0,1,0))), this.materials.planet2Smooth.override({color: Color.of(0.0745, 0.38824, 0.0745,1)}));
        }
        this.planet_2 = model_transform.times(Mat4.rotation(2.5*t, Vec.of(0,1,0))); //store in class variable

        // Planet 3
        // translate back to the sun, rotate there, translate back
        model_transform = model_transform.times(Mat4.translation([-8,0,0]));
        model_transform = model_transform.times(Mat4.rotation(-0.2*t, Vec.of(0,1,0))); //rotate the planets around sun
        model_transform = model_transform.times(Mat4.translation([11,0,0]));
        this.shapes.sphere_subdiv4.draw(graphics_state, model_transform.times(Mat4.rotation(1.6*t, Vec.of(0,1,1))), this.materials.planet3.override({color: Color.of(0.8, 0.533333, 0.10588,1)}));
        this.planet_3 = model_transform.times(Mat4.rotation(1.6*t, Vec.of(0,1,1)));

        // Planet 3 Ring - rotate before scaling so planet and rings rotate together 
//         this.shapes.torus.draw(graphics_state, model_transform.times(Mat4.rotation(1.6*t, Vec.of(0,1,1))).times(Mat4.scale([1.05,1.05,0.1])), this.materials.planet3.override({color: Color.of(0.8, 0.533333, 0.10588,1)}));
        this.shapes.torus.draw(graphics_state, model_transform.times(Mat4.rotation(1.6*t, Vec.of(0,1,1))).times(Mat4.scale([1.05,1.05,0.1])), this.materials.ring);

        // Planet 4 
        // translate back to the sun, rotate there, translate back
        model_transform = model_transform.times(Mat4.translation([-11,0,0]));
        model_transform = model_transform.times(Mat4.rotation(-0.2*t, Vec.of(0,1,0))); //rotate the planets around sun
        model_transform = model_transform.times(Mat4.translation([14,0,0]));
        let model_temp = model_transform;
        this.shapes.sphere_subdiv4.draw(graphics_state, model_transform.times(Mat4.rotation(t, Vec.of(0,1,0))), this.materials.planet4.override({color: Color.of(0.4784,0.6627,0.9804,1)}));
        this.planet_4 = model_transform.times(Mat4.rotation(t, Vec.of(0,1,0)));

        // Planet 4 Moon
        model_transform = model_transform.times(Mat4.rotation(t, Vec.of(0,1,0))); //rotate moon around planet 4
        model_transform = model_transform.times(Mat4.translation([2.2, 0, 0]));
        this.shapes.sphere_subdiv1.draw(graphics_state, model_transform.times(Mat4.rotation(t, Vec.of(0,1,0))), this.materials.planet4.override({color: Color.of(0.4784,0.6627,0.9804,1)}));
        this.moon = model_transform.times(Mat4.rotation(t, Vec.of(0,1,0)));
        

        // Planet 5
//         model_transform = model_4_transform;
        model_transform = model_temp; // stay relative to planet 4 and not planet 4's moon
        model_transform = model_transform.times(Mat4.translation([-14,0,0]));
        model_transform = model_transform.times(Mat4.rotation(-0.2*t, Vec.of(0,1,0))); //rotate the planets around sun
        model_transform = model_transform.times(Mat4.translation([17,0,0]));
        this.shapes.grid_sphere.draw(graphics_state, model_transform.times(Mat4.rotation(0.7*t, Vec.of(0,1,0))), this.materials.planet5.override({color: Color.of(0.8275,0.8275,0.8275,1)}));
        this.planet_5 = model_transform.times(Mat4.rotation(0.7*t, Vec.of(0,1,0)));
      }
  }


// Extra credit begins here (See TODO comments below):

window.Ring_Shader = window.classes.Ring_Shader =
class Ring_Shader extends Shader              // Subclasses of Shader each store and manage a complete GPU program.
{ material() { return { shader: this } }      // Materials here are minimal, without any settings.
  map_attribute_name_to_buffer_name( name )       // The shader will pull single entries out of the vertex arrays, by their data fields'
    {                                             // names.  Map those names onto the arrays we'll pull them from.  This determines
                                                  // which kinds of Shapes this Shader is compatible with.  Thanks to this function, 
                                                  // Vertex buffers in the GPU can get their pointers matched up with pointers to 
                                                  // attribute names in the GPU.  Shapes and Shaders can still be compatible even
                                                  // if some vertex data feilds are unused. 
      return { object_space_pos: "positions" }[ name ];      // Use a simple lookup table.
    }
    // Define how to synchronize our JavaScript's variables to the GPU's:
  update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
      { const proj_camera = g_state.projection_transform.times( g_state.camera_transform );
                                                                                        // Send our matrices to the shader programs:
        gl.uniformMatrix4fv( gpu.model_transform_loc,             false, Mat.flatten_2D_to_1D( model_transform.transposed() ) );
        gl.uniformMatrix4fv( gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(     proj_camera.transposed() ) );
      }
  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    { return `
        attribute vec3 object_space_pos;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_transform;

        void main()
        { 
          position = vec4(object_space_pos, 1.0);
          gl_Position = projection_camera_transform * model_transform * vec4(object_space_pos, 1.0);
          center = position * vec4(0,0,0,1);
        }`;           // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
    }
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********: Color(0.8, 0.533333, 0.10588,1)
    { return `
        void main()
        { 
          gl_FragColor = vec4(0.4*sin(distance(center,position)*30.0-1000.0)+0.4, 0.26666*sin(distance(center,position)*30.0-1000.0)+0.26666, 0.05294*sin(distance(center,position)*30.0-1000.0)+0.05294,1);
        }`;           // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
    }
}

window.Grid_Sphere = window.classes.Grid_Sphere =
class Grid_Sphere extends Shape           // With lattitude / longitude divisions; this means singularities are at 
  { constructor( rows, columns, texture_range )             // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
      { super( "positions", "normals", "texture_coords" );
        

                      // TODO:  Complete the specification of a sphere with lattitude and longitude lines
                      //        (Extra Credit Part III)

        const circle_points = Array( rows ).fill( Vec.of( .75,0,0 ) )
                                           .map( (p,i,a) => Mat4.translation([ 0,0,0 ])
                                                    .times( Mat4.rotation( i/(a.length) * 2*Math.PI, Vec.of( 0,-1,0 ) ) )
                                                    .times( p.to4(1) ).to3() );

        Surface_Of_Revolution.insert_transformed_copy_into( this, [ rows, columns, circle_points ] );

      } }


/*
window.Torus = window.classes.Torus =
class Torus extends Shape                                         // Build a donut shape.  An example of a surface of revolution.
  { constructor( rows, columns )  
      { super( "positions", "normals", "texture_coords" );
        const circle_points = Array( rows ).fill( Vec.of( .75,0,0 ) )
                                           .map( (p,i,a) => Mat4.translation([ -2,0,0 ])
                                                    .times( Mat4.rotation( i/(a.length-1) * 2*Math.PI, Vec.of( 0,-1,0 ) ) )
                                                    .times( p.to4(1) ).to3() );

        Surface_Of_Revolution.insert_transformed_copy_into( this, [ rows, columns, circle_points ] );         
      } }
*/