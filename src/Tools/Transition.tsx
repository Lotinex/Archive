import React, { ComponentClass } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Framework from './Framework'
import '../base.css'

import { ProjectDescriptor } from './TitleProject'

const stage = document.getElementById('stage')


type PathExpression = {
    [path: string] : typeof Framework //??
}
export function PathResolver(pathObject: PathExpression):void {
    ReactDOM.render(
        <>
        <div id="subStage">
            <ProjectDescriptor />
        </div>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            {
                Object.keys(pathObject).map(path => {
                    let replaceExact = path.replace('!','')
                    return <Route path={`/${replaceExact === 'index' ? '' : replaceExact}`} component={pathObject[path] as any} exact={path.startsWith('!')} />
                })
            }
        </BrowserRouter>
        </>,
        stage
    )
}
export function Transition(path: string):void {
    window.location.href = `/${path}`
}






