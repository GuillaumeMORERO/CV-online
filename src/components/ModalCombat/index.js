import React from 'react';

import ClassNames from 'classnames';

import { useDispatch, useSelector } from 'react-redux';

import { Modal } from 'react-bootstrap';

import './style.scss';

import { changeBlindage, changePV } from 'src/store/player/actions';
import { hideCombatModal, showScores, resetScores } from 'src/store/combat/actions';
import { blindageLoss } from 'src/store/foe/actions';
import { changeMessage } from 'src/store/message/actions';


export default () => {

  const dispatch = useDispatch();
  const player = useSelector(state => state.player);
  const { showed, resultPlayer, resultFoe } = useSelector(state => state.combat);
  const foe = useSelector(state => state.foe);
  const { message, category } = useSelector(state => state.message);

  const handleClose = () => {
    dispatch(hideCombatModal());
    dispatch(resetScores());
  };
  
  function entierAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const dieRoll = () => {
    return entierAleatoire(1, 6)
  };
  const characLaunch = (habileté) => {
    const d6 = [];
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    let lancé = 0;
    while ( lancé < habileté ) {
      lancé++;
      d6.push(dieRoll());
    }
    return d6.reduce(reducer, 0);
  };
  const playerWin = (result) => {
    if (foe.blindage > result) {
      dispatch(blindageLoss(result));
      dispatch(changeMessage('T\'as infligé ' + result + ' point(s) de dégâts au blindage de l\'ennemi !', 'good'))
      
    } 
    if (foe.blindage <= result) {
      dispatch(changePV(foe.gain));
      dispatch(changeMessage('T\'as remporté une grande victoire... Et empoche ' + foe.gain + ' Points de Victoire !', 'good'));
      setTimeout(() => {
        dispatch(hideCombatModal())
      }, 3000);
    } 
  };
  const foeWin = (nbr) => {
    const result = nbr - (nbr*2);
    if (player.blindage > result) {
      dispatch(changeBlindage(nbr));
      dispatch(changeMessage('L\'ennemi a infligé ' + result + ' point(s) de dégâts a ton blindage !', 'bad'));
      
    } 
    if (player.blindage <= result) {
      dispatch(changeBlindage(nbr));
      dispatch(changeMessage('T\as perdu ce combat... T\'en fais pas, il te reste toute une guerre !!', 'bad'));
      setTimeout(() => {
        dispatch(hideCombatModal());
      }, 3000);
    } 
  };
  const fighting = (habPlayer, habFoe) => {
    const scorePlayer = characLaunch(habPlayer);
    const scoreFoe = characLaunch(habFoe);

    dispatch(showScores(scorePlayer, scoreFoe));

    const result = scorePlayer - scoreFoe;
    if (result > 0) {
      playerWin(result);
    };
    if (result < 0) {
      foeWin(result);
    };
    if (result === 0) {
      dispatch(changeMessage('Personne ne remporte cette passe... continue à te battre !', 'nul'));
    };
  }; 

  const activClass = ClassNames(
    'infoCombat', 
    {
      bad: category === 'bad'
    },
    {
      good: category === 'good'
    },
    {
      nul: category === 'nul'
    }
  );

  return <div className="combat">

    <Modal show={showed} onHide={handleClose} size="xl" centered id="combatModal">

      <Modal.Header className="combat-titre">
        <Modal.Title className="combat-titre-txt">
          <div>Ici on se bagarre !!</div>  
          <div>Si tu le sens pas (...Mouais...), ferme cette fenêtre et ouvre la à nouveau.</div>  
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="combat-corps">

        <div className="arene">

          <section className="player">

            <h1 className="player-name">{player.nom}</h1>
            <h2 className="player-descr">{player.descr}</h2>

            <div className="player-carac">

              <img className="player-carac_avatar" id="caracPlayer" src={player.avatar} alt="avatar"/>
              <div className="player-carac_contains">
                <div className="player-carac_contains-comp">
                  <p id="espace">Habileté</p>
                  <div id="spanbr">{player.habileté}</div>
                </div>
                <div className="player-carac_contains-comp">
                  <p id="espace">Blindage</p>
                  <div id="spanbr">{player.blindage}</div>
                </div>
              </div>

            </div>
          
          </section>

          <section className="foe">
          <h1 className="foe-name">{foe.name}</h1>
          <h2 className="foe-descr">{foe.descr}</h2>

          <div className="foe-carac">

            <img className="foe-carac_avatar" src={foe.avatar} alt="avatar"/>
            <div className="foe-carac_contains">
              <div className="player-carac_contains-comp">
                <p id="espace">Habileté</p>
                <div id="spanbr">{foe.skill}</div>
              </div>
              <div className="player-carac_contains-comp">
                <p id="espace">Blindage</p>
                <div id="spanbr">{foe.blindage}</div>
              </div>
            </div>

          </div>
        </section>

        </div>
        <div className="btncenter">
          <button
            className="btncenter-fight"
            type="button"
            onClick={() => fighting(player.habileté, foe.skill)}
            style={{display: player.blindage <= 0 ? 'none' : '' }}
          >
            Fight !!!
          </button>
          <button
            className="btncenter-fight"
            type="button"
            onClick={() => handleClose()}
            style={{display: player.blindage <= 0 ? 'none' : '' }}
          >
            Fuite !!!
          </button>
        </div>

      </Modal.Body>

      <Modal.Footer className="combat-pied">
        <div className="displayer" style={{display: resultPlayer ? '' : 'none' }}>
          <div className={activClass}>{message}</div>
          <div className="displayer-secondary">
            <div className="infoDice">
              <span id="espace">Avec {player.habileté} dé(s), tu obtiens :</span>   
              <span id="spanbr">{resultPlayer}</span>
            </div>
            <div className="infoDice">
              <span id="espace">Avec {foe.skill} dé(s), {foe.name} a obtenu :</span> 
              <span id="spanbr">{resultFoe}</span>
            </div>
          </div>
        </div>
      </Modal.Footer>

    </Modal>

  </div>
}