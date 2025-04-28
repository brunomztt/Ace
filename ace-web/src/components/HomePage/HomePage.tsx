import React, { forwardRef } from 'react';

const HomePage = forwardRef<HTMLDivElement>((props, ref) => {
    return <div ref={ref}>Home Page</div>;
});

export default HomePage;
