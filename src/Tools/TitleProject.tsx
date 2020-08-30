import Util from './Utils'
import Framework from './Framework'
import autobind from 'autobind-decorator'
import L from './Language'
import React from 'react'

export const REVOLUTION_SPEED = 0.03;
export class ProjectEntity {

    public x: number;
    public y : number;
    public radius: number;
    public color: string;
    public descriptionValue: string; //FIXME: test
    public id: string;

    constructor(baseX: number, baseY: number, baseRadius: number, baseColor: string, id: string){
        this.x = baseX;
        this.y = baseY;
        this.radius = baseRadius;
        this.color = baseColor;
        this.descriptionValue = '';
        this.id = id;
    }
    public render(renderCtx: CanvasRenderingContext2D): void {
        renderCtx.beginPath()
        renderCtx.fillStyle = this.color;
        renderCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        renderCtx.fill()
        renderCtx.closePath()
    }
    public static registeredConditions : {
        [id: string] : {
            position: boolean;
            rendered: boolean;
            value: string;
        }
    } = {};

    // 일단 제목 여부같은것과 상관없이 단일 문자열로 된 설명창을 띄운다.
    public description(value: string): void {
        this.descriptionValue = value;
        let descriptionRendered = false;
        document.addEventListener('mousemove', e => {

            let x = e.pageX
            let y = e.pageY

            ProjectEntity.registeredConditions[this.id] = {
                position : x >= (this.x - this.radius) && x <= (this.x + this.radius) && y >= (this.y - this.radius) && y <= (this.y + this.radius),
                /**
                 * @deprecated
                 */
                rendered : false,
                value : this.descriptionValue
            }


            for(let id in ProjectEntity.registeredConditions){
                const current = ProjectEntity.registeredConditions[id];

                if(current.position){
                    Framework.action('renderDescription', current.value, {x, y});
                    ProjectEntity.registeredConditions[id].rendered = true;
                }
            }
            let atLeastOne = false;
            for(let id in ProjectEntity.registeredConditions){
                if(ProjectEntity.registeredConditions[id].position){
                    atLeastOne = true;
                    break;
                }
            }
            if(!atLeastOne){
               Framework.action('hideDescriptor');
            }

        })
    }

    public static getRevolutionRadius(parentRadius: number, parentChildNumber: number): number {
        return parentRadius + (50 * (parentChildNumber === 0 ? 1 : parentChildNumber))
    }

}
export class ProjectStar extends ProjectEntity {

    private title: string;
    private nowChildNumber: number;
    constructor(title: string, baseX: number, baseY: number, baseRadius: number, baseColor: string, id: string){
        super(baseX, baseY, baseRadius, baseColor, id);
        this.title = title;
        this.nowChildNumber = 0;
    }
    //생성 후 작성
    public update(){}

    public map(child: ProjectPlanet): void {
        this.nowChildNumber++;
        //아직 child를 가지고 뭔가를 하지는 않는다.

    }

}
export class ProjectPlanet extends ProjectEntity {
    
    private name: string;
    private parentStar: Partial<{
        x : number;
        y : number;
        radius: number;
        nowChildNumber: number;
    }> = {};
    private changer: number;

    constructor(name: string, baseX: number, baseY: number, baseRadius: number, baseColor: string, id: string){
        super(baseX, baseY, baseRadius, baseColor, id);
        this.name = name;
        this.changer = Util.random(0, 30);
    }

    //생성 후 작성
    public update(){}
    private calculateRevolution(type : "x" | "y"): number {
        const method = type === "x" ? "sin" : "cos"
        return Math[method](this.changer) * 
        ProjectEntity.getRevolutionRadius(this.parentStar.radius as number, this.parentStar.nowChildNumber as number)
        + (this.parentStar[type] as number);

    }
    public revolution(speed: number): void {
        this.changer += speed;

        this.x = this.calculateRevolution("x");
        this.y = this.calculateRevolution("y");

    }
    public map(star: ProjectStar): void {
        Object.assign(this.parentStar, star)
    }

}
@autobind 
export class ProjectRenderer extends Framework<Refer.Props.ProjectRenderer, Refer.State.ProjectRenderer> {

    private readonly canvasRef = React.createRef<HTMLCanvasElement>();
    private ctx: CanvasRenderingContext2D | null = null;

    state: Refer.State.ProjectRenderer = {
        shouldUpdate : true,
        entities : this.props.entities,
    }
    update(): void {
        if(this.state.shouldUpdate) {
            const canvasWidth = this.canvasRef.current?.width as number;
            const canvasHeight = this.canvasRef.current?.height as number;

            (this.ctx as CanvasRenderingContext2D).clearRect(0, 0, canvasWidth, canvasHeight)

            this.renderEntities()
            window.requestAnimationFrame(this.update)
        }
    }
    renderEntities(): void {
        for(const entity of this.state.entities){
            entity.render(this.ctx as CanvasRenderingContext2D);
            entity.update();
        }
    }
    componentDidMount(): void {
        this.ctx = this.canvasRef.current?.getContext("2d") as CanvasRenderingContext2D;
        window.requestAnimationFrame(this.update)
    }
    componentWillUnmount(): void {
        this.setState({ shouldUpdate : false })
    }
    render(): React.ReactNode {
        return (
            <canvas ref={this.canvasRef} width={window.innerWidth} height={window.innerHeight} className="projectViewer"/>
        )
    }
}
@autobind
export class ProjectDescriptor extends Framework<Refer.Props.ProjectDescriptor, Refer.State.ProjectDescriptor> {

    state: Refer.State.ProjectDescriptor = {
        renderingText : '',
        visible : false,
        position : {x: 0, y: 0},
    }
    Union: Partial<Refer.Global.UNION> = {
        'renderDescription' : (value, position) => {
            this.setState({ visible : true });
            this.setState({ position });
            this.setState({ renderingText : value });
        },
        'hideDescriptor' : () => {
            this.setState({ visible : false });
        }
    }
    render(): React.ReactNode {
        return (
            <>
                {this.state.visible ?
                    <div className="project-descriptor" style={{left: `${this.state.position.x + 10}px`, top: `${this.state.position.y + 10}px`}}>
                        {this.state.renderingText}
                    </div>
                    : null
                }
            </>
        )
    }
}
