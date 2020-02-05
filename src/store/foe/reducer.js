import { CHARGE_FOE, BLINDAGE_LOSS } from './actions';

const initialState = {
  id: 0,
  name: '?',
  skill: '',
  blindage: '',
  gain: 0,
  avatar: 'src/data/interog.png',
  descr: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHARGE_FOE: {
      return {
        ...state,
        id: action.value.id,
        name: action.value.name,
        skill: action.value.skill,
        blindage: action.value.blindage,
        avatar: action.value.avatar,
        descr: action.value.descr,
        gain: action.value.gain
      };
    }
    case BLINDAGE_LOSS: {
      return {
        ...state,
        blindage: state.blindage - action.value,
      };
    }
    default: {
      return state;
    }
  }
}