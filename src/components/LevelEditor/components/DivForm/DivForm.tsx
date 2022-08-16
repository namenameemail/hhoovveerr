import cn from 'classnames';
import { DivParameters, DivState, SizeUnit, Vec } from "../../store/divTree/types";
import {
    BlurEnterNumberInputFor,
    BlurEnterTextInputFor, CheckboxFor, For,
    NumberDragPointerLockFor,
    Vec2DragPointerLockFor
} from "../../../For";
import {
    getRandomColor,
    DivDragHandler,
    DragEvent,
    DivDragPointerLockHandler,
    BlurEnterTextInput,
} from 'bbuutoonnss';
import { Checkbox } from "../../../Checkbox";
import { SelectArrayFor } from "../../../For/components/SelectArrayFor";
import { blendModes, borderTypes, sizeUnits } from "../../const";
import React, { RefObject, useCallback } from "react";
import {
    deleteDiv,
    divDown,
    divUp,
    selectDivByPath, selectDivByPathWithParentAngle,
    selectDivTreeRoot,
    updateDivParameters
} from "../../store/divTree";
import { useEditorDispatch, useEditorSelector } from "../../store";
import { SelectArray } from "../../../SelectArray";
import { refService } from "../EditDiv/refService";
import { getPathParentPath } from "../../utils/tree";
import { ImageSelect, ImageSelectFor } from "../ImageSelect";
import { FontSelectFor } from "../FontSelect";

export interface DivFormProps {
    className?: string;

    path: string;

}

export function DivForm(props: DivFormProps) {

    const { className, path } = props;

    const parentPath = getPathParentPath(path)

    const parentDiv  = useEditorSelector(selectDivByPath(parentPath))
    const { div: state, parentAngle } = useEditorSelector(selectDivByPathWithParentAngle(path))

    const parameters = state?.parameters || {} as DivParameters;
    const { ref: parentDivRef } = refService.refs[parentPath] || {}

    const dispatch = useEditorDispatch();

    const handleDivParamsChange = useCallback((divParams: DivParameters, name?: string, isIntermediate?: boolean) => {
        dispatch(updateDivParameters({ path, divParams, nohistory: isIntermediate }));
    }, [path, parameters]);

    const handleDivSizeChange = useCallback(({ x, y, isDragEnd }: DragEvent, e: MouseEvent, savedSize?: Vec) => {

        if (savedSize === undefined) {
            return;
        }

        // const viewSize: Vec = [window.innerWidth, window.innerHeight];
        const rootSize: Vec = [refService.refs[''].ref.current?.offsetWidth || 0, refService.refs[''].ref.current?.offsetHeight || 0];


        const getValueChange: { [key: string]: (value: number, parentSize: number, viewSize: Vec) => number } = {
            ['px']: (size: number, parentSize: number, viewSize: Vec) => (size),
            ['%']: (size: number, parentSize: number, viewSize: Vec) => size / parentSize * 100,

            ['vw']: (size: number, parentSize: number, viewSize: Vec) => (size / viewSize[0] * 100),
            ['vh']: (size: number, parentSize: number, viewSize: Vec) => (size / viewSize[1] * 100),
        };


        const { borderWidth: parentBorderWidth = 0 } = parentDiv?.parameters || {};
        const parentSize: Vec = parentDivRef?.current
            ? [parentDivRef.current.offsetWidth - 2 * parentBorderWidth, parentDivRef.current.offsetHeight - 2 * parentBorderWidth]
            : rootSize;

        dispatch(updateDivParameters({
            path,
            divParams: {
                ...parameters,
                size: [
                    Math.max(0, savedSize[0] + getValueChange[parameters.sizeXUnit](x, parentSize[0], rootSize)),
                    Math.max(0, savedSize[1] + getValueChange[parameters.sizeYUnit](y, parentSize[1], rootSize)),
                ]
            },
            nohistory: !isDragEnd
        }));
    }, [path, parameters, parentDivRef, parentDiv]);



    const handleDivStartPointChange = useCallback((event: DragEvent, e: MouseEvent, savedStart?: Vec) => {

        if (savedStart === undefined) {
            return;
        }

        const { x, y, isDragStart, isDragEnd } = event;
        // const viewSize: Vec = [window.innerWidth, window.innerHeight];
        const rootSize: Vec = [refService.refs[''].ref.current?.offsetWidth || 0, refService.refs[''].ref.current?.offsetHeight || 0];

        const getValueChange: { [key: string]: (value: number, parentSize: number, viewSize: Vec) => number } = {
            ['px']: (size: number, parentSize: number, viewSize: Vec) => (size),
            ['%']: (size: number, parentSize: number, viewSize: Vec) => size / parentSize * 100,

            ['vw']: (size: number, parentSize: number, viewSize: Vec) => (size / viewSize[0] * 100),
            ['vh']: (size: number, parentSize: number, viewSize: Vec) => (size / viewSize[1] * 100),
        };


        const { borderWidth = 0 } = parentDiv?.parameters || {};
        const parentSize: Vec = parentDivRef?.current
            ? [parentDivRef.current.offsetWidth - 2 * borderWidth, parentDivRef.current.offsetHeight - 2 * borderWidth]
            : rootSize;

        dispatch(updateDivParameters({
            path,
            divParams: {
                ...parameters,
                startPoint: [
                    savedStart[0] + getValueChange[parameters.startXUnit](x, parentSize[0], rootSize),
                    savedStart[1] + getValueChange[parameters.startYUnit](y, parentSize[1], rootSize)
                ]
            },
            nohistory: !isDragEnd,
        }));
    }, [path, parameters, parentDivRef, parentDiv]);


    const handleUnitChange = useCallback((value: string, name: string) => {

        if (!parentDivRef?.current) {
            return;
        }
        const { borderWidth = 0 } = parentDiv?.parameters || {};
        const parentSize: Vec = [parentDivRef.current.offsetWidth - 2 * borderWidth, parentDivRef.current.offsetHeight - 2 * borderWidth];
        // const viewSize: Vec = [window.innerWidth, window.innerHeight];
        const rootSize: Vec = [refService.refs[''].ref.current?.offsetWidth || 0, refService.refs[''].ref.current?.offsetHeight || 0];


        const oldUnit = parameters[name as keyof DivParameters];
        const newUnit = value;

        const transformDirection = [oldUnit, newUnit].join('-');

        const getValueChange: { [key: string]: (size: number, parentSize: number, viewSize: Vec) => number } = {
            ['%-px']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * parentSize),
            ['px-%']: (size: number, parentSize: number, viewSize: Vec) => (size / parentSize * 100),

            ['px-vw']: (size: number, parentSize: number, viewSize: Vec) => (size / viewSize[0] * 100),
            ['vw-px']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * viewSize[0]),
            ['px-vh']: (size: number, parentSize: number, viewSize: Vec) => (size / viewSize[1] * 100),
            ['vh-px']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * viewSize[1]),

            ['%-vw']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * parentSize / viewSize[0] * 100),
            ['vw-%']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * viewSize[0] / parentSize * 100),
            ['%-vh']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * parentSize / viewSize[1] * 100),
            ['vh-%']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * viewSize[1] / parentSize * 100),


            ['vw-vh']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * viewSize[0] / viewSize[1] * 100),
            ['vh-vw']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * viewSize[1] / viewSize[0] * 100),
        };

        const getChange: { [key: string]: (parameters: DivParameters) => Partial<DivParameters> } = {
            startXUnit: (parameters: DivParameters) => ({
                startPoint: [
                    getValueChange[transformDirection](parameters.startPoint[0], parentSize[0], rootSize),
                    parameters.startPoint[1]
                ]
            }),
            startYUnit: (parameters: DivParameters) => ({
                startPoint: [
                    parameters.startPoint[0],
                    getValueChange[transformDirection](parameters.startPoint[1], parentSize[1], rootSize)
                ]
            }),
            sizeXUnit: (parameters: DivParameters) => ({
                size: [
                    getValueChange[transformDirection](parameters.size[0], parentSize[0], rootSize),
                    parameters.size[1]
                ]
            }),
            sizeYUnit: (parameters: DivParameters) => ({
                size: [
                    parameters.size[0],
                    getValueChange[transformDirection](parameters.size[1], parentSize[1], rootSize)
                ]
            }),
        };


        dispatch(updateDivParameters({
            path,
            divParams: {
                ...parameters,
                ...getChange[name]?.(parameters),
                [name]: value,
            },
        }));
    }, [path, parameters, parentDiv, parentDivRef]);

    const handleDelete = useCallback(() => {
        dispatch(deleteDiv({ path }));
    }, [path]);
    const handleUp = useCallback(() => {
        dispatch(divUp({ path }));
    }, [path]);
    const handleDown = useCallback(() => {
        dispatch(divDown({ path }));
    }, [path]);


    const sizeTextValue = parameters.size.map(i => i.toFixed(2)).join(', ');
    const sizeTextHandler = useCallback((value: string) => {
        const [xStr, yStr] = value.split(',');
        const [xNum, yNum] = [Number.isFinite(+xStr) ? +xStr : 0, Number.isFinite(+yStr) ? +yStr : 0];

        dispatch(updateDivParameters({
            path,
            divParams: {
                ...parameters,
                size: [xNum, yNum]
            },
        }));
    }, [parameters, path]);

    const startPointTextValue = parameters.startPoint.map(i => i.toFixed(2)).join(', ');
    const startPointTextHandler = useCallback((value: string) => {
        const [xStr, yStr] = value.split(',');
        const [xNum, yNum] = [Number.isFinite(+xStr) ? +xStr : 0, Number.isFinite(+yStr) ? +yStr : 0];

        dispatch(updateDivParameters({
            path,
            divParams: {
                ...parameters,
                startPoint: [xNum, yNum]
            },
        }));
    }, [parameters, path]);
    const shadowOffsetTextValue = parameters.shadowXYOffset?.map(i => i.toFixed(2)).join(', ') || '0, 0';
    const shadowOffsetTextHandler = useCallback((value: string) => {
        const [xStr, yStr] = value.split(',');
        const [xNum, yNum] = [Number.isFinite(+xStr) ? +xStr : 0, Number.isFinite(+yStr) ? +yStr : 0];

        dispatch(updateDivParameters({
            path,
            divParams: {
                ...parameters,
                shadowXYOffset: [xNum, yNum]
            },
        }));
    }, [parameters, path]);
    const textOffsetTextValue = parameters.textPosition?.map(i => i.toFixed(2)).join(', ') || '0, 0';
    const textOffsetTextHandler = useCallback((value: string) => {
        const [xStr, yStr] = value.split(',');
        const [xNum, yNum] = [Number.isFinite(+xStr) ? +xStr : 0, Number.isFinite(+yStr) ? +yStr : 0];

        dispatch(updateDivParameters({
            path,
            divParams: {
                ...parameters,
                textPosition: [xNum, yNum]
            },
        }));
    }, [parameters, path]);
    const textShadowXYOffsetTextValue = parameters.textShadowXYOffset?.map(i => i.toFixed(2)).join(', ') || '0, 0';
    const textShadowXYOffsetTextHandler = useCallback((value: string) => {
        const [xStr, yStr] = value.split(',');
        const [xNum, yNum] = [Number.isFinite(+xStr) ? +xStr : 0, Number.isFinite(+yStr) ? +yStr : 0];

        dispatch(updateDivParameters({
            path,
            divParams: {
                ...parameters,
                textShadowXYOffset: [xNum, yNum]
            },
        }));
    }, [parameters, path]);

    return (
        <For<DivParameters>
            className={cn(className)}
            value={parameters}
            onChange={handleDivParamsChange}
        >
            {['root', ...(path ?[path] : [])].join('-')}
            <NumberDragPointerLockFor name={'angle'} min={0}>
                <BlurEnterNumberInputFor name={'angle'}></BlurEnterNumberInputFor>
            </NumberDragPointerLockFor>

            <DivDragPointerLockHandler<Vec>
                angle={parentAngle}
                saveValue={parameters.size}
                onChange={handleDivSizeChange}
            >
                {parentAngle}
                <BlurEnterTextInput
                    value={sizeTextValue}
                    changeOnEnter
                    resetOnBlur
                    onChange={sizeTextHandler}
                    name={'size'}></BlurEnterTextInput>
            </DivDragPointerLockHandler>

            <SelectArray name={'sizeXUnit'} options={sizeUnits} title={'sizeXUnit'} value={parameters.sizeXUnit}
                         onChange={handleUnitChange}></SelectArray>
            <SelectArray name={'sizeYUnit'} options={sizeUnits} title={'sizeYUnit'} value={parameters.sizeYUnit}
                         onChange={handleUnitChange}></SelectArray>

            <DivDragPointerLockHandler<Vec>
                angle={parentAngle}
                saveValue={parameters.startPoint}
                onChange={handleDivStartPointChange}
            >
                <BlurEnterTextInput
                    value={startPointTextValue}
                    changeOnEnter
                    resetOnBlur
                    onChange={startPointTextHandler}
                    name={'startPoint'}></BlurEnterTextInput>
            </DivDragPointerLockHandler>

            <SelectArray name={'startXUnit'} options={sizeUnits} title={'startXUnit'} value={parameters.startXUnit}
                         onChange={handleUnitChange}></SelectArray>
            <SelectArray name={'startYUnit'} options={sizeUnits} title={'startYUnit'} value={parameters.startYUnit}
                         onChange={handleUnitChange}></SelectArray>


            {/*<Checkbox name={'relativeSizeX'} value={parameters.relativeSizeX}*/}
            {/*          onChange={handleRelativeSizeXChange}></Checkbox>*/}
            {/*<Checkbox name={'relativeSizeY'} value={parameters.relativeSizeY}*/}
            {/*          onChange={handleRelativeSizeYChange}></Checkbox>*/}
            {/*<Checkbox name={'relativeStartX'} value={parameters.relativeStartX}*/}
            {/*          onChange={handleRelativeStartXChange}></Checkbox>*/}
            {/*<Checkbox name={'relativeStartY'} value={parameters.relativeStartY}*/}
            {/*          onChange={handleRelativeStartYChange}></Checkbox>*/}


            <BlurEnterTextInputFor name={'color'}></BlurEnterTextInputFor>
            <NumberDragPointerLockFor name={'borderWidth'} min={0}>
                <BlurEnterNumberInputFor name={'borderWidth'}></BlurEnterNumberInputFor>
            </NumberDragPointerLockFor>
            <NumberDragPointerLockFor name={'borderRadius'} min={0}>
                <BlurEnterNumberInputFor name={'borderRadius'}></BlurEnterNumberInputFor>
            </NumberDragPointerLockFor>
            <SelectArrayFor name={'borderStyle'} options={borderTypes} title={'borderStyle'}></SelectArrayFor>
            <BlurEnterTextInputFor name={'borderColor'}></BlurEnterTextInputFor>
            <SelectArrayFor name={'blendMode'} options={blendModes} title={'blendMode'}></SelectArrayFor>

            <CheckboxFor name={'shadowInset'}/>
            <Vec2DragPointerLockFor angle={parentAngle + parameters.angle} name={'shadowXYOffset'}>
                <BlurEnterTextInput
                    value={shadowOffsetTextValue}
                    changeOnEnter
                    resetOnBlur
                    onChange={shadowOffsetTextHandler}
                    name={'shadowXYOffset'}></BlurEnterTextInput>
            </Vec2DragPointerLockFor>
            <NumberDragPointerLockFor name={'shadowBlur'} min={0}>
                <BlurEnterNumberInputFor name={'shadowBlur'}></BlurEnterNumberInputFor>
            </NumberDragPointerLockFor>
            <NumberDragPointerLockFor name={'shadowSpread'} min={0}>
                <BlurEnterNumberInputFor name={'shadowSpread'}></BlurEnterNumberInputFor>
            </NumberDragPointerLockFor>

            <BlurEnterTextInputFor name={'shadowColor'}  placeholder={'shadow color'}></BlurEnterTextInputFor>


            {/*<BlurEnterNumberInputFor name={'backgroundImageId'} placeholder={'image'}></BlurEnterNumberInputFor>*/}

            <ImageSelectFor name={'backgroundImageName'}/>
            <BlurEnterTextInputFor name={'text'} placeholder={'text'}/>

            <Vec2DragPointerLockFor angle={parentAngle + parameters.angle} name={'textPosition'}>
                <BlurEnterTextInput
                    value={textOffsetTextValue}
                    changeOnEnter
                    resetOnBlur
                    onChange={textOffsetTextHandler}
                    name={'textPosition'}></BlurEnterTextInput>
            </Vec2DragPointerLockFor>
            <BlurEnterTextInputFor
                name={'fontSize'} placeholder={'fontSize'}></BlurEnterTextInputFor>
            {/*<BlurEnterTextInputFor*/}
            {/*    name={'font'} placeholder={'font'}></BlurEnterTextInputFor>*/}
            <FontSelectFor name={'font'}/>
            <BlurEnterTextInputFor
                name={'textColour'} placeholder={'text color'}></BlurEnterTextInputFor>

            <Vec2DragPointerLockFor angle={parentAngle + parameters.angle} name={'textShadowXYOffset'}>
                <BlurEnterTextInput
                    value={textShadowXYOffsetTextValue}
                    changeOnEnter
                    resetOnBlur
                    onChange={textShadowXYOffsetTextHandler}
                    name={'textShadowXYOffset'}></BlurEnterTextInput>
            </Vec2DragPointerLockFor>

            <NumberDragPointerLockFor name={'textShadowBlur'} min={0}>
                <BlurEnterNumberInputFor name={'textShadowBlur'}></BlurEnterNumberInputFor>
            </NumberDragPointerLockFor>
            <BlurEnterTextInputFor
                name={'textShadowColor'} placeholder={'text shadow color'}></BlurEnterTextInputFor>

            <button onClick={handleDelete}>delete</button>
            <button onClick={handleDown}>down</button>
            <button onClick={handleUp}>up</button>


        </For>
    );
}

