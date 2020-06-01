import React from 'react';

class Form extends React.Component {
    render() {
        const { children } = this.props;
        return (
                <form id='add-task-form'>
                    {children}
                </form>
        );
    };
};

export default Form;
