declare namespace Refer {
    namespace Props {
        type ProjectRenderer = {
            entities : Array<import('../Tools/TitleProject').ProjectPlanet | import('../Tools/TitleProject').ProjectStar>;
        }
        type ProjectDescriptor = {
        }
    }
    namespace State {
        type ProjectRenderer = {
            shouldUpdate : boolean;
            entities : Array<import('../Tools/TitleProject').ProjectPlanet | import('../Tools/TitleProject').ProjectStar>;
        }
        type ProjectDescriptor = {
            renderingText: string;
            visible: boolean;
            position: {x: number, y: number};
            scrollY: number;
        }
    }
    namespace Global {
        type UNION = {
            'renderDescription' : (value: string, position:{x: number, y: number}) => void;
            'hideDescriptor' : () => void;
        }
    }
}
