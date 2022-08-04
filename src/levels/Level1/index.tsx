import { DivHover } from "../../components/DivHover/DivHover";
import cn from 'classnames';
import s from './styles.module.css';
import a from '../../css/atomic.module.css';
import { StairsHover } from "../../components/StairsHover";

export interface Level1Props {

}

export function Level1() {

    return (
        <div>
            <DivHover relative width={300} height={200} background={"#87c6ff"}>
                <DivHover absolute width={300} height={100} left={0} bottom={0} background={"#9d8f4f"}>
                    <DivHover open absolute width={260} height={150} left={10} bottom={30} background={"#384349"}/>
                    <DivHover open absolute width={260} height={50} left={10} bottom={130} background={"#3d2527"}/>
                    <DivHover open absolute width={20} height={162} left={0} bottom={25} background={"#9da8ad"}/>
                    <DivHover open absolute width={110} height={100} left={180} bottom={75} background={"#2b3f27"}/>
                    <DivHover open absolute width={60} height={90} left={220} bottom={70} background={"#061011"}/>
                    <DivHover open absolute width={180} height={30} left={20} bottom={50} background={"#061011"}/>
                    <DivHover open absolute width={180} height={30} left={20} bottom={50} background={"#061011"}/>
                </DivHover>
            </DivHover>
        </div>
    );
}

