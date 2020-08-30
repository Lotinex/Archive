export default class L {
    public static numberFromPx(expression: string): number {
        return parseInt(expression.replace('px', ''));
    }
    public static remove(targetString: string, value: any){
        return targetString.replace(value, '');
    }
    public static parseRGB(rgbString: string){
        let RGBValues = L.remove(L.remove(rgbString, 'rgb('), ')').split(',');
        
        return {
            r : parseInt(RGBValues[0]),
            g : parseInt(RGBValues[1]),
            b : parseInt(RGBValues[2])
        }
    }
    public static debug(text: any){
        console.log("%cDEBUG" + "%c | " + `%c${text}`, 'background:black; color:white;', 'font-weight:bold;', 'color: red;')
    }
}