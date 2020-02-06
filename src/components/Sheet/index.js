import React, { useState } from 'react';

import ClassNames from 'classnames';

import { Container, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';

import { useSelector, useDispatch } from 'react-redux';

import './style.scss';
import { changeHabilete, changeBlindage, changePV } from 'src/store/player/actions';
import { chargeFoe } from 'src/store/foe/actions';
import { resetMessage, changeMessage } from 'src/store/message/actions';
import { displayCombatModal, resetScores } from 'src/store/combat/actions';
import { displayBuyModal } from 'src/store/buy/actions';
import { displayContactModal } from 'src/store/contact/actions';

export default ({ foes }) => {

  const dispatch = useDispatch();
  const player = useSelector(state => state.player);
  const { message } = useSelector(state => state.message);
  const { showed } = useSelector(state => state.combat);
  const { show } = useSelector(state => state.buy);
  const { contactShow } = useSelector(state => state.contact);

  const [showMess, setShowMess] = useState(false);
  const handleClose = () => setShowMess(false);
  const handleShow = () => setShowMess(true);

  function entierAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const dieRoll = () => {
    return entierAleatoire(1, 6)
  };
  const modifCarac = (carac, cost) => {
    const result = player.ptvict - cost;
    const jetD6 = dieRoll();
    if (result >= 0) {
      if (carac === 'habileté') {
        dispatch(changeHabilete(jetD6))
        dispatch(changeMessage('Ton Habileté a été augmentée de 1 !'));
      }
      if (carac === 'blindage') {
        dispatch(changeBlindage(jetD6))
        dispatch(changeMessage('Ton Blindage a été augmentée de ' + jetD6));
      }
      const modif = cost - (cost*2);
      dispatch(changePV(modif));

    } else {
      dispatch(changeMessage('essaie pas de tricher,c\'est pas bien !!'));
    }
    
    handleShow();
  };
  const CombatTrigger = () => {
    const foeAleatoire = entierAleatoire(0, foes.length - 1);
    dispatch(chargeFoe(foes[foeAleatoire]));
    dispatch(resetMessage());
    dispatch(resetScores());
    dispatch(displayCombatModal());
  };

  const buyModalDiplayer = () => {
    dispatch(resetMessage());
    dispatch(displayBuyModal());
  };
  const contactModalDiplayer = () => {
    dispatch(displayContactModal());
  };

  const activeClass = ClassNames(
    'mainContainer',
    {
      blured: showed || showMess || show || contactShow
    }
  );
  
  return <Container
    fluid
    className={activeClass}
    id="sheet"
    style={{display: player.choosen ? '' : 'none' }}
  >

    <div className="pic">
      <img className="pic-arrow_left see" src="src/data/bluearrow.png" alt="arrow"/>
      <div className="pic-ture">
        <img className="pic-ture_head" src={player.avatar} alt="Tête de vainqueur"/>
      </div>
      <img className="pic-arrow_right see" src="src/data/bluearrow.png" alt="arrow"/>
    </div>

    <div className="launchers">
      <h2
      className="launchers-bot"
        onClick={() => CombatTrigger()}
        >Lance un combat !!
      </h2>
      <h2
        onClick={() => { buyModalDiplayer()} }
        className="launchers-bot"
      >Débloques des sections du CV
      </h2>
      <h2
        onClick={() => { contactModalDiplayer()} }
        className="launchers-bot"
      >Contacte moi !
      </h2>
    </div>

    <div className="hud" style={{display: player.blindage > 0 ? '' : 'none' }}>

      <div className="hud-name">
        <h1 className="hud-name_perso"> {player.nom} </h1>
      </div>

      <p className="hud-descr"> {player.descr} </p>

      <div className="separateur-1">

        <div className="hud-carac">
          <div className="separateur-2">
            <OverlayTrigger
              key="top"
              placement="top"
              overlay={
                <Tooltip id="tooltip-top">
                  Nombre de points d' Habileté. Jet de 1D6 par points pour les combats.
                </Tooltip>
              }
            >
              <p className="hud-carac_title">Habileté</p>
          </OverlayTrigger>
          </div>
          <div className="hud-carac_display">
          Nombre de dé(s) : 
            <div className="hud-carac_display-cadre">
              {player.habileté}
            </div>
          </div>
        </div>

        <div className="hud-carac">
          <div className="separateur-2">
            <OverlayTrigger
              key="top"
              placement="top"
              overlay={
                <Tooltip id="tooltip-top">
                  Nombre de points de blindage. A zero, c'est perdu !
                </Tooltip>
              }
            >
              <p className="hud-carac_title">Blindage</p>
          </OverlayTrigger>
          </div>
          <div className="hud-carac_display">
            Point(s) de restant(s) : 
            <div className="hud-carac_display-cadre">
              {player.blindage}
            </div>
          </div>
        </div>

        <div className="hud-carac">
          <div className="separateur-2">
            <OverlayTrigger
              key="top"
              placement="top"
              overlay={
                <Tooltip id="tooltip-top">
                  Nombre de points de victoire. Permet de débloquer dees sections, d'améliorer le blindage ou l'habileté.
                </Tooltip>
              }
            >
              <p className="hud-carac_title">Point(s) de Victoire</p>
          </OverlayTrigger>
          </div>
          <div className="hud-carac_display">
            <p>Point(s) de restant(s) : </p>
            <div className="hud-carac_display-cadre">
              {player.ptvict}
            </div>
          </div>
        </div>
        
      </div>

      <div className="separateur-3">

        <div className="hud-tuner">
          <OverlayTrigger
            key="top"
            placement="top"
            overlay={
              <Tooltip id="tooltip-top">
                Dépense 3 points de victoires pour réparer ton blindage de 1D6
              </Tooltip>
            }
          >
            <p className="hud-notice">Répare ton blindage de 1D6 pour 3 P.V.</p>
          </OverlayTrigger>
          <img
            src="src/data/tools.png"
            alt="tools"
            className="hud-icon"
            onClick={() => modifCarac('blindage', 3)}
          />
        </div>

        <div className="hud-tuner">
          <OverlayTrigger
            key="top"
            placement="top"
            overlay={
              <Tooltip id="tooltip-top">
                Dépense 8 points de victoires pour améliorer ton habileté !
              </Tooltip>
            }
          >
            <p className="hud-notice">Améliore ton habileté de 1 pour 8 P.V.</p>
          </OverlayTrigger>
          <img
            src="src/data/compass.png"
            alt="compass"
            className="hud-icon"
            onClick={() => modifCarac('habileté', 8)}
          />
        </div>

      </div>

    </div>

    <div className="mort" style={{display: player.blindage <= 0 ? '' : 'none' }}>
      <a className="mort-tadel" href="/">
        <div className="mort-amor" >T' as perdu ?!?</div>  
        <div className="mort-amor" >Clique pour recommencer... Et fait plus attention !!</div>
      </a>
    </div>

    <div className="tunerContainer">
      <Modal show={showMess} onHide={handleClose} centered>
        <div className="tunedModal">
          <Modal.Header>
            <Modal.Title className="tunedModal-txt"> {message} </Modal.Title>
          </Modal.Header>
        </div>
      </Modal>
    </div>

  </Container>

}