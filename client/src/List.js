import React from 'react';

class List extends React.Component {

  render() {
    const { children } = this.props;
    return(
      <div>
          <ul className="tasks-section__list" id="tasks-list">
            {children}
          </ul>
      </div>
    );
  };
};

export default List;
