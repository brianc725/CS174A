window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
class Assignment_Three_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,0,5 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        // TODO:  Create two cubes, including one with the default texture coordinates (from 0 to 1), and one with the modified
        //        texture coordinates as required for cube #2.  You can either do this by modifying the cube code or by modifying
        //        a cube instance's texture_coords after it is already created.
        const shapes = { box:   new Cube(),
                         box_2: new Cube(),
                         axis:  new Axis_Arrows(),
                         complex: new Complex_Shape(15, 15)
                       }
        // change the texture coordinates of box 2 so that it is zoomed out by 50%    
        shapes.box_2.texture_coords = [  Vec.of(0,0),   Vec.of(2,0),   Vec.of(0,2), Vec.of(2,2), 
                                         Vec.of(0,0),   Vec.of(2,0),   Vec.of(0,2), Vec.of(2,2),
                                         Vec.of(0,0),   Vec.of(2,0),   Vec.of(0,2), Vec.of(2,2),
                                         Vec.of(0,0),   Vec.of(2,0),   Vec.of(0,2), Vec.of(2,2),
                                         Vec.of(0,0),   Vec.of(2,0),   Vec.of(0,2), Vec.of(2,2),
                                         Vec.of(0,0),   Vec.of(2,0),   Vec.of(0,2), Vec.of(2,2) ];
        this.submit_shapes( context, shapes );

        // TODO:  Create the materials required to texture both cubes with the correct images and settings.
        //        Make each Material from the correct shader.  Phong_Shader will work initially, but when 
        //        you get to requirements 6 and 7 you will need different ones.
        this.materials =
          { phong: context.get_instance( Phong_Shader ).material( Color.of( 0.4863,0.3137,0.6667,1 ) ),
            bricks: context.get_instance( Texture_Rotate ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance( "assets/duck.jpeg", false ) } ),
            rocks: context.get_instance( Texture_Scroll_X ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance( "assets/tree.jpeg", true ) } ),
          }

        this.lights = [ new Light( Vec.of( -5,5,5,1 ), Color.of( 0,1,1,1 ), 100000 ) ];

        // TODO:  Create any variables that needs to be remembered from frame to frame, such as for incremental movements over time.
        this.leftBoxRotate = Mat4.identity().times(Mat4.translation([-2,0,0]));
        this.rightBoxRotate = Mat4.identity().times(Mat4.translation([2,0,0]));
        this.complexShape = Mat4.identity().times(Mat4.translation([0,-2,0])).times(Mat4.scale([0.5,0.5,0.5]));

        this.rotation_activated = 0; // initially dont start off with rotation

      }
    make_control_panel()
      { // TODO:  Implement requirement #5 using a key_triggered_button that responds to the 'c' key.
        this.key_triggered_button( "Rotation",       [ "c" ], () => {
            this.rotation_activated = !this.rotation_activated; // either multiply rotation by 0 or 1
          } );
        
      }
    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

        // TODO:  Draw the required boxes. Also update their stored matrices.
        // this.shapes.axis.draw( graphics_state, Mat4.identity(), this.materials.bricks );

        // false for mip map so uses nearest neighbor
        // rotate at 30 rpm ~ 1 divided by time in cycle = 1/3*(0.0166) ~ 30
        this.leftBoxRotate = this.leftBoxRotate.times(Mat4.rotation(3*dt * this.rotation_activated, [1,0,0]));
        this.shapes.box.draw(graphics_state, this.leftBoxRotate, this.materials.bricks);

        // box 2 so scaled out 50%
        // rotate at 20 rpm ~ 1 divided by time in cycle = 1/2*(0.0166) ~ 20
        this.rightBoxRotate = this.rightBoxRotate.times(Mat4.rotation(2*dt * this.rotation_activated, [0,1,0]));
        this.shapes.box_2.draw(graphics_state, this.rightBoxRotate, this.materials.rocks);

        // Extra credit 1 to look like starmie
        this.shapes.complex.draw(graphics_state, this.complexShape, this.materials.phong);
      }
  }

class Texture_Scroll_X extends Phong_Shader
{ fragment_glsl_code()           // ********* FRAGMENT SHADER ********* 
    {
      // TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #6.
      return `
        uniform sampler2D texture;
        void main()
        { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
          { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
            return;
          }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                            // Phong shading is not to be confused with the Phong Reflection Model.
          
          // the new shifted value          
          vec4 new_texture_coordinate4 = vec4(f_tex_coord, 0, 1); 

          // verbose x and y split to shift x by 2 units every second; modulo 1 so doesnt get too big - we only care about the decimal
          vec2 new_texture_coordinate = vec2(new_texture_coordinate4.x + mod(2.*animation_time, 1.0), new_texture_coordinate4.y);

          vec4 tex_color = texture2D( texture, new_texture_coordinate );                         // Sample the texture image in the correct place.
                                                                                      // Compute an initial (ambient) color:
          if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w ); 
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.
        }`;
    }
}

class Texture_Rotate extends Phong_Shader
{ fragment_glsl_code()           // ********* FRAGMENT SHADER ********* 
    {
      // TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #7.
      return `
        uniform sampler2D texture;
        void main()
        { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
          { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
            return;
          }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                            // Phong shading is not to be confused with the Phong Reflection Model.
          
  
          // translate down left to bottom leftBoxRotate
          mat4 t_down = mat4(1.,0.,0.,0.,  0.,1.,0.,0.,  0.,0.,1.,0.,  -0.5,-0.5,0.,1.);

          // rotation
          //15 RPM = pi/2 rad/s. 2pi rad = 1 hz so f = 0.25 HZ
          float pi = 3.14159;
          float rpm_conversion = pi/2.; // this is 2 * pi * f

          // no need to wrap around values when animation_time grows since 
          mat4 r = mat4(cos(rpm_conversion* animation_time), sin(rpm_conversion*animation_time), 0., 0., -sin(rpm_conversion*animation_time), cos(rpm_conversion*animation_time), 0., 0., 0, 0,1, 0, 0, 0, 0, 1);

          // translate up right to original 
          mat4 t_up = mat4(1.,0.,0.,0.,  0.,1.,0.,0.,  0.,0.,1.,0.,  0.5,0.5,0.,1.);

          vec4 new_texture_coordinate4 = t_up * r * t_down * vec4(f_tex_coord, 0, 1); //remove r, do verbose x and y split and add by animation time
          vec2 new_texture_coordinate = vec2(new_texture_coordinate4.xy);


          vec4 tex_color = texture2D( texture, new_texture_coordinate );                         // Sample the texture image in the correct place.
                                                                                      // Compute an initial (ambient) color:
          if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w ); 
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.
        }`;
    }
}