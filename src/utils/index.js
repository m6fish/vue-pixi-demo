import * as PIXI from 'pixi.js'

/**
* 繪製輻射漸層
* @param {Array} param.colorArr required, 漸層顏色，由外而內
* @param {Array} param.stepArr optional, 漸層自定義step，未提供則使用平均區間
* @param {Number} param.width required, 寬度
* @param {Number} param.height required, 高度
* @returns PIXI.Texture
*/
export const radialBg = ({ colorArr, stepArr = [], width, height }) => {
    const canvas = document.createElement('canvas')
    const maxRadius = Math.max(width, height)
    canvas.setAttribute('width', maxRadius)
    canvas.setAttribute('height', maxRadius)

    const ctx = canvas.getContext('2d')
    const maxhalf = 0.5 * maxRadius
    const grd = ctx.createRadialGradient(maxhalf, maxhalf, maxhalf, maxhalf, maxhalf, 0)

    colorArr.forEach((rawColor, idx) => {
        const step = stepArr[idx] || (1 / (colorArr.length - 1)) * idx
        grd.addColorStop(step, rawColor)
    })

    let [scaleX, scaleY] = [1, 1]
    if (width >= height) {
        scaleY = height / width
    } else {
        scaleX = width / height
    }

    ctx.fillStyle = grd
    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0)
    ctx.fillRect(0, 0, Math.max(width, height), Math.max(width, height))
    return new PIXI.Texture.from(canvas)
}
