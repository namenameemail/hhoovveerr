import { ComponentType, ReactNode } from "react";

export function renderRecursionHOC<Props extends { children?: ReactNode }>(count: number, Component: ComponentType<Props>) {
    const renderRecursiveComponent = (props: Props, i: number = 0) => {
        return i < count
            ? (
                <Component {...props}>
                    {renderRecursiveComponent(props, ++i)}
                </Component>
            )
            : props.children;
    };
    return (props: Props) => {
        return renderRecursiveComponent(props);
    };
}

//
// export function renderRecursionHOC2<TItem, TProps>(array: TItem[], component: (item: TItem, index: number, array: TItem[]) => ComponentType<TProps>) {
//     const renderRecursiveComponent = (props: any, i: number = 0) => {
//
//         return i < count
//             ? (
//                 <Component {...props}>
//                     {renderRecursiveComponent(props, ++i)}
//                 </Component>
//             )
//             : null;
//     };
//     return (props: Props) => {
//         return renderRecursiveComponent(props);
//     };
// }