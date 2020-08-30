import Framework from '../../Tools/Framework'
import autobind from 'autobind-decorator'
import React from 'react'
import './index.css'
import L from '../../Tools/Language'
import { ProjectPlanet, ProjectStar, ProjectRenderer, ProjectDescriptor } from '../../Tools/TitleProject'
import Util from '../../Tools/Utils'

const Teststar = [new ProjectStar('web', 700, 300, 50, `rgb(255,255,255)`, `id-${Util.random(1,1000)}`), new ProjectStar('web', 1000, 400, 50, `rgb(255,255,255)`,`id-${Util.random(1,1000)}`)]
Teststar[0].update = function(){
    const currentColor = L.parseRGB(this.color);
    if(currentColor.b <= 0){
        this.color = `rgb(255,255,255)`
    }
    else this.color = `rgb(${currentColor.r - 0.7},${currentColor.g - 1.4},${currentColor.b - 3.5})`
}
Teststar[0].description('tesssssst')
Teststar[1].update = function(){
    const currentColor = L.parseRGB(this.color);
    if(currentColor.b <= 0){
        this.color = `rgb(255,255,255)`
    }
    else this.color = `rgb(${currentColor.r - 0.7},${currentColor.g - 1.4},${currentColor.b - 3.5})`
}
Teststar[1].description("asda")
let planetList: ProjectPlanet[] = [];
for(let i=1; i<4; i++){
    const planet = new ProjectPlanet('test', 1, 1, 20, `rgb(${Util.random(0, 255)}, ${Util.random(0, 255)}, ${Util.random(0, 255)})`,`id-${Util.random(1,1000)}`);

    Teststar[0].map(planet)
    planet.map(Teststar[0])
    planet.update = function(){
        this.revolution(0.0007 * i);
    }
    planetList.push(planet)
}
for(let i=1; i<4; i++){
    const planet = new ProjectPlanet('test', 1, 1, 20, `rgb(${Util.random(0, 255)}, ${Util.random(0, 255)}, ${Util.random(0, 255)})`,`id-${Util.random(1,1000)}`);

    Teststar[1].map(planet)
    planet.map(Teststar[1])
    planet.update = function(){
        this.revolution(0.0007 * i);
    }
    planetList.push(planet)
}



@autobind
class ProjectView extends Framework {
    render(): React.ReactNode {
        return (
            <>
                <ProjectRenderer  entities={[
                    ...Teststar,
                    ...planetList
                ]}/>
            </>
        )
    }
}
@autobind
class Title extends Framework {
    render():React.ReactNode {
        return (
            <>
                <div className="title-box">
                    <div className="title-cover">
                        <div className="title-info">
                            <div className="title-lotinex">이름</div>
                            <div className="title-lotinex-info">설명1</div>
                        </div>
                    </div>
                    <ProjectView />
                    <div className="milestone-down">
                        <i className="fas fa-angle-down"></i>
                    </div>
                </div>
            </>
        )
    }
}

@autobind
export default class Main extends Framework {
    render(): React.ReactNode {
        return (
            <>
                <Title />
                <div className="bottom"></div>
            </>
        )
    }
}