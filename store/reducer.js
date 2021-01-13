import {videos} from '../data';

const initilState = {
  video: videos,
};

const reducer = (state = initilState, action) => {
  if (action.type == 'PULL_VIDEOS') {
    const data = action.data;
    const updatedState = state.video;

    const newstate = updatedState.filter((i, index) => {
      if (i.name != data) {
        return i;
      } else {
        console.log(i, 'dropped');
      }
    });

    for (let i = 0; i < updatedState.length; i++) {
      // console.log(updatedState[i].name, 'fore loop');
      if (updatedState[i].name == data) {
        newstate.splice(0, 0, updatedState[i]);
      }
      console.log(newstate, 'name');
    }

    // console.log(newstate);
    // console.log(main);
    return {
      ...state,
      video: newstate,
    };
  }
  return state;
};

export default reducer;
