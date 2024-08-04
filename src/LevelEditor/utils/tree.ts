import { Div, DivId, DivById } from "../store/currentProject/tree/types";
import { v4 as uuid } from 'uuid';

export const updateById = (elements: DivById, id: string, update: (state: Div) => Div) => {
    return {
        ...elements,
        [id]: elements[id] ? update(elements[id] as Div) : elements[id]
    };
};

export const deleteById = (elements: DivById, id: string) => {

    const iteration = (elements: DivById, id: DivId): DivById => {
        const {[id]: deletedElement, ...newElements} = elements;


        const parentElementId = deletedElement?.parent as string;
        const parentElement = newElements[parentElementId];

        if (parentElement) {
            newElements[parentElementId] = {
                ...parentElement,
                children: parentElement.children.filter((childId) => childId !== id)
            }
        }


        if (deletedElement) {

            return deletedElement.children.reduce((elements, childId) => iteration(elements, childId), newElements);
        }

        return newElements
    };



    return iteration(elements, id);
};


export const addById = (elements: DivById, targetId: DivId, state: Omit<Div, 'id' | 'parent'>): DivById => {

    const newElementId = uuid();

    if (elements[targetId]) {
        const targetElement = elements[targetId] as Div;
        return {
            ...elements,
            [newElementId]: {
                ...state,
                id: newElementId,
                parent: targetId
            },
            [targetId]: {
                ...targetElement,
                children: [
                    ...targetElement.children,
                    newElementId,
                ]
            }
        };
    } else {
        return elements;
    }
};

export const getAllCollectableIds = (elements: DivById): DivId[] => {

    return Object.entries(elements)
        .filter(([elementId, element]) => element?.behaviorParameters.isCollectable)
        .map(([elementId, element]) => elementId);
};


export const getIdsPathById = (elements: DivById, id?: string): DivId[] => {
    if (!id) return [];

    let currentElement = elements[id as string];
    const ids = [id];

    while (currentElement?.parent) {
        const parentElement = elements[currentElement.parent];
        const parentElementId = parentElement?.id;
        parentElementId && ids.push(parentElementId);
        currentElement = parentElement;
    }

    return ids;
};

export const getOrderPathById = (elements: DivById, id?: string): string => {
    if (!id) return '';

    let currentElement = elements[id as string];
    const path: string[] = [];

    while (currentElement?.parent) {
        const parentElement = elements[currentElement.parent];

        if (parentElement) {
            const index = parentElement.children.indexOf(currentElement.id)

            index !== -1 && path.unshift(index.toString());

        }

        currentElement = parentElement;

    }
    path.unshift('r')

    return path.join('-');
};

export const getByIdWithParentAngle = (elements: DivById, id: DivId): {
    div: Div | undefined
    parentAngle: number
} => {

    let parentAngle = 0;
    let currentElement = elements[id];
    while (currentElement?.parent) {
        const parentElement = elements[currentElement.parent];
        parentAngle += parentElement?.positionParameters.angle || 0;
        currentElement = parentElement;
    }

    return { div: elements[id], parentAngle };
};