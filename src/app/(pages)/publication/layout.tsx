interface layoutProps {
    children: React.ReactNode;
}

const layout: React.FC<layoutProps> = ({ children }) => {
    return (
        <div className="max-w-7xl mx-auto my-24 px-2 md:px-6 xl:px-10 ">
            {children}
        </div>
    );
};

export default layout;
