class Floor extends Platform {
    constructor({ y, height }) {
        super({ x: 0, y });
        this.height = height;
        this.width = canvas.width;
    }
}
 
export default Floor;