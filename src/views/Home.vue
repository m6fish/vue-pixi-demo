<template>
  <div class="home">
      <div ref="gameContainer" />
  </div>
</template>

<script>
// @ is an alias to /src
import * as PIXI from 'pixi.js'
import logo from '@/assets/logo.png'

export default {
    name: 'Home',
    data () {
        return {
            app: null
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            console.log('Hello Pixi')
            this.app = new PIXI.Application({
                width: 800,
                height: 600
                // antialias: true,
                // resolution: this.devicePixelRatio
            })
            this.$refs.gameContainer.appendChild(this.app.view)

            // load the texture we need
            this.app.loader.add('logo', logo).load((loader, resources) => {
                console.log(resources)
                // This creates a texture from a 'logo.png' image
                const logo = new PIXI.Sprite(resources.logo.texture)

                // Setup the position of the logo
                logo.x = this.app.renderer.width / 2
                logo.y = this.app.renderer.height / 2

                // Rotate around the center
                logo.anchor.x = 0.5
                logo.anchor.y = 0.5

                // Add the logo to the scene we are building
                this.app.stage.addChild(logo)

                // Listen for frame updates
                this.app.ticker.add(() => {
                    // each frame we spin the logo around a bit
                    logo.rotation += 0.01
                })
            })
        }
    }
}
</script>
