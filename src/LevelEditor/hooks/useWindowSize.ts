import { useCallback, useLayoutEffect, useState } from "react";

export function useWindowResizeCallback(onResize: any, deps: any[]) {
    const handleResize = useCallback(onResize, deps)
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            const size = [window.innerWidth, window.innerHeight]
            setSize(size);
            handleResize(size)
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, [handleResize]);
    return size;
}