import React from 'react'


type ArgsOf<T> = T extends (...args: infer A) => any ? A : never;
type UNION_REFER_TABLE = {
    [key in keyof Refer.Global.UNION] : Array<Refer.Global.UNION[key]>;
}
export default abstract class Framework<P= {}, S ={}> extends React.PureComponent<P, S> {
    abstract render():React.ReactNode;


    public Union: Partial<Refer.Global.UNION> = {};

    public static UnionReferTable: Partial<UNION_REFER_TABLE> = {};
    public static action<T extends keyof Refer.Global.UNION, A extends ArgsOf<Refer.Global.UNION[T]>>(unionName: T, ...args: A): void {
        (Framework.UnionReferTable[unionName] as any).forEach((receiver: (...args: A) => void) => {
            receiver(...args);
        })
    }
    componentDidMount(): void {
        let union: keyof Refer.Global.UNION;

        for(union in this.Union){
            if(!Framework.UnionReferTable.hasOwnProperty(union)){
                (Framework.UnionReferTable[union] as any) = [ this.Union[union] ];
            } else {
               (Framework.UnionReferTable[union] as any).push(this.Union[union]);
            }
        }
    }
}
