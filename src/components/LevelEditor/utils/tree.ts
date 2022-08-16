import { DivState } from "../store/divTree/types";
import { PATH_SPLITTER } from "../store/divTree/consts";

export const getPathParentPath = (path: string) => {
    const pathArray = path.split('-');
    return pathArray.length > 1 ? pathArray.slice(0, -1).join('-') : '';
};
export const getPathIndex = (path: string) => {
    const pathArray = path.split('-');
    return +pathArray[pathArray.length - 1];
};

export const getPathParentAndIndex = (path: string) => {
    const pathArray = path.split('-');
    const parentPath = pathArray.length > 1 ? pathArray.slice(0, -1).join('-') : '';
    const index = +pathArray[pathArray.length - 1];
    return { parentPath, index };
};
export const updateByPath = (root: DivState, pathString: string, update: (state: DivState) => DivState) => {

    const path = pathString ?
        pathString.split(PATH_SPLITTER)
            .map(index => +index) :
        [];

    if (!path.length) {
        return update(root);
    }

    const iteration = (node: DivState, i: number = 0) => {
        const newNode = {
            ...node,
            children: [...node.children]
        };

        if (i < path.length - 1) {
            newNode.children[path[i]] = iteration(newNode.children[path[i]], ++i);
        } else {
            newNode.children[path[i]] = update(newNode.children[path[i]]);
        }

        return newNode;
    };

    return iteration(root);
};

export const deleteByPath = (root: DivState, pathString: string) => {
    const path = pathString
        .split(PATH_SPLITTER)
        .map(index => +index);

    const iteration = (node: DivState, i: number = 0): DivState => {
        const newNode: DivState = {
            ...node,
            children: [...node.children]
        };

        if (i < path.length - 1) {
            newNode.children[path[i]] = iteration(newNode.children[path[i]], ++i);
        } else {
            newNode.children.splice(path[i], 1);
        }

        return newNode;
    };

    return iteration(root);
};
export const addByPath = (root: DivState, pathString: string, state: DivState): DivState => {
    const path = pathString
        ? pathString.split(PATH_SPLITTER).map(index => +index)
        : [];

    const iteration = (node: DivState, i: number = 0): DivState => {
        const newNode: DivState = {
            ...node,
            children: [...node.children]
        };

        if (i <= path.length - 1) {
            newNode.children[path[i]] = iteration(newNode.children[path[i]], ++i);
        } else {
            newNode.children.push(state);
        }

        return newNode;


    };

    return iteration(root);
};


export const getByPath = (root: DivState, pathString: string): DivState | undefined => {
    const path = pathString
        ? pathString.split(PATH_SPLITTER).map(index => +index)
        : [];

    const iteration = (node?: DivState, i: number = 0): DivState | undefined => {
        if (i < path.length) {
            return iteration(node?.children[path[i]], ++i);
        } else {
            return node;
        }
    };

    return iteration(root);
};

export const getByPathWithParentAngle = (root: DivState, pathString: string): {
    div: DivState | undefined
    parentAngle: number
} => {
    const path = pathString
        ? pathString.split(PATH_SPLITTER).map(index => +index)
        : [];

    let parentAngle = 0;
    const iteration = (node?: DivState, i: number = 0): DivState | undefined => {
        if (i < path.length) {
            // console.log('parentAngle', path, i, parentAngle, node?.parameters.angle)
            parentAngle += (node?.parameters.angle || 0);
            return iteration(node?.children[path[i]], ++i);
        } else {
            return node;
        }
    };


    return { div: iteration(root), parentAngle };
};