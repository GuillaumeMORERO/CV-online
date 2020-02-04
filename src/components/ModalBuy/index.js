import React from 'react';

import ClassNames from 'classnames';

import { useDispatch, useSelector } from 'react-redux';

import { Modal } from 'react-bootstrap';

import './style.scss';

import { hideBuyModal } from 'src/store/buy/actions';
import { changeStatus } from 'src/store/cv/actions';
import { changePV } from 'src/store/player/actions';
import { changeMessage } from 'src/store/message/actions';

export default ({ datas }) => {
  
  const dispatch = useDispatch();
  const { ptvict, nom, avatar } = useSelector(state => state.player);
  const readable = useSelector(state => state.cv);
  const { show } = useSelector(state => state.buy);
  const { message, category } = useSelector(state => state.message);

  const handleClose = () => {
    dispatch(hideBuyModal());
  };

  function entierAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const d4plus1Roll = () => {
    return entierAleatoire(2, 5)
  };
  const currentCost = d4plus1Roll();

  const buyOpening = (id, cost) => {
    if ( ptvict >= cost ) {
      const realCost = cost - (cost * 2);
      const realID = id - 1;
      dispatch(changePV(realCost));
      dispatch(changeStatus(id));
      dispatch(changeMessage('Bravo, t\'as débloqué la section ' + id + ' . ' + datas[realID].titreCarte, 'good'));
    }
    if ( ptvict < cost ) {
      dispatch(changeMessage('c\'est pas bien de tricher....', 'bad'));
    }
    
  };

  const activClass = ClassNames(
    'infoBuy', 
    {
      bad: category === 'bad'
    },
    {
      good: category === 'good'
    }
  );

  return <div className="buy">

    <>
      <Modal show={show} onHide={handleClose} size="xl" centered id="buyModal">
        <Modal.Header className="buy-titre">
          <Modal.Title className="buy-titre-txt">Ici on achete des ouvertures de section...</Modal.Title>
        </Modal.Header>

        <Modal.Body className="buy-corps">
          <div className="buy-corps_contains">
            <section className="buy-corps_contains-sections">
              {datas.map((item) => (
                <div key={item.id}>
                  <div className="buy-corps_contains-sections-list">
                    { readable[item.id] && 
                      <>
                        <h1
                          className="teteSection-titrecarte"
                          style={{color: '#009465'}}>
                          {item.id}. {item.titreCarte} <div className="min"> - disponible !!! -</div> 
                        </h1>
                      </>
                      }
                    { !readable[item.id] && 
                      <>
                        <h1
                          className="teteSection-titrecarte"
                          style={{color: '#9c4563'}}>
                          {item.id}. {item.titreCarte} <div className="min"> - non disponible !!! -</div>  
                        </h1>
                        <h2
                          className="teteSection-buy"
                          onClick={() => buyOpening(item.id, currentCost)}>
                          Pour ouvrir : {currentCost} points de victoires...
                        </h2>
                      </>
                    }
                  </div>
                  
                </div>
              ))}
            </section>
            <section className="buy-corps_contains-infos">
              <img src={avatar} alt="avatar" className="buy-corps_contains-infos-avatar"/>
              <div className="buy-corps_contains-infos-reste"> {nom}, il te reste {ptvict} points de victoire. </div>
            </section>

          </div>
        </Modal.Body>

        <Modal.Footer className="buy-pied">
          <button
            className="btncenter-fight infoBuy-close"
            type="button"
            onClick={() => handleClose()}
          >
            Fermer !!
          </button>
          <div className={activClass}>{message}</div>
        </Modal.Footer>
      </Modal>
    </>

  </div>
}