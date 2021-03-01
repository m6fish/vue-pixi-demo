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
            app: null,
            theSprite: null
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            console.log('Hello Pixi')
            // 讓chrome pixi devTool出現
            if (process.env.NODE_ENV === 'development') {
                window.PIXI = PIXI
            }

            this.app = new PIXI.Application({
                width: 800,
                height: 600
                // transparent: true // 背景透明
            })

            // 展開全螢幕
            this.app.renderer.view.style.position = 'absolute'
            this.app.renderer.view.style.display = 'block'
            this.app.renderer.autoResize = true
            this.app.renderer.resize(window.innerWidth, window.innerHeight)

            this.$refs.gameContainer.appendChild(this.app.view)

            // load the texture we need
            const picName = 'logo'
            this.app.loader.add(picName, logo)
                .load((loader, resources) => {
                    // This creates a texture from a 'logo.png' image
                    const logoSprite = new PIXI.Sprite(resources[picName].texture)
                    this.theSprite = logoSprite

                    // Setup the position of the logo
                    logoSprite.x = this.app.renderer.width / 2
                    logoSprite.y = this.app.renderer.height / 2

                    // Rotate around the center
                    logoSprite.anchor.x = 0.5
                    logoSprite.anchor.y = 0.5

                    // move
                    logoSprite.vx = 0
                    logoSprite.vy = 0

                    // Add the logo to the scene we are building
                    this.app.stage.addChild(logoSprite)

                    // Listen for frame updates
                    this.app.ticker.add(this.gameLoop)
                })
                .onProgress.add(this.gameProgress)
        },
        gameLoop (delta) {
            // each frame we spin the logo around a bit
            this.theSprite.rotation += 0.01

            if (this.theSprite.vx === 0) {
                this.theSprite.vx = 1
                this.theSprite.vy = 1
            } else if (this.theSprite.vx === 1 && this.theSprite.x > 800) {
                this.theSprite.vx = -1
                this.theSprite.vy = -1
            } else if (this.theSprite.vx === -1 && this.theSprite.x < 500) {
                this.theSprite.vx = 1
                this.theSprite.vy = 1
            }

            this.theSprite.x += this.theSprite.vx
            this.theSprite.y += this.theSprite.vy
        },
        gameProgress (loader, resource) {
            // Display the file `url` currently being loaded
            console.log('loading: ' + resource.url)

            // Display the percentage of files currently loaded
            console.log('progress: ' + loader.progress + '%')

            // If you gave your files names as the first argument
            // of the `add` method, you can access them like this
            console.log('loading: ' + resource.name)
        }
    }
}
</script>
