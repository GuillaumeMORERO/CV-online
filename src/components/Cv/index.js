import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import ClassNames from 'classnames';

import { Container, Accordion, Card, Button, ListGroup } from 'react-bootstrap';

import './style.scss';

import { displayCombatModal, resetScores } from 'src/store/combat/actions';
import { displayBuyModal } from 'src/store/buy/actions';
import { chargeFoe } from 'src/store/foe/actions';
import { resetMessage } from 'src/store/message/actions';
import { displayContactModal } from 'src/store/contact/actions';



export default ({ datas, foes }) => {

  function entierAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const dispatch = useDispatch();
  const { choosen } = useSelector(state => state.player);
  const readable = useSelector(state => state.cv);
  const { showed } = useSelector(state => state.combat);
  const { show } = useSelector(state => state.buy);
  const { contactShow } = useSelector(state => state.contact);

  const CombatTrigger = () => {
    const foeAleatoire = entierAleatoire(1, foes.length - 1);
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
      blured: showed || show || contactShow
    }
  );

  return <Container
    fluid
    className={activeClass}
    id="cv"
    style={{display: choosen ? '' : 'none' }}
  >

    <div className="pic">
      <img className="pic-arrow_left see" src="src/data/bluearrow.png" alt="arrow"/>
      <div className="pic-ture">
        <img className="pic-ture_head" src="src/data/Aboth.png" alt="Tête de vainqueur"/>
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
      >Débloque des sections du CV
      </h2>
      <h2
        onClick={() => { contactModalDiplayer()} }
        className="launchers-bot"
      >Contacte moi !
      </h2>
    </div>

    <div className="elem" id="elem">


      <Accordion defaultActiveKey="1" bsPrefix="accordion">
        {datas.map((item) => (
          <Card key={item.id} id={'section' + item.id}>
            
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey={item.id}>
                <img className="frame" src="src/data/framehigh.png" alt="framehigh"/>
                <div className="teteAccordion">
                  { readable[item.id] && 
                    <h1
                      className="teteAccordion-titrecarte"
                      id="sizeTitle"
                      style={{color: '#009465'}}>
                      {item.id}. {item.titreCarte} <div className="min"> - disponible !!! -</div> 
                    </h1>
                  }
                  { !readable[item.id] && 
                    <h1
                      className="teteAccordion-titrecarte"
                      id="sizeTitle"
                      style={{color: '#9c4563'}}>
                      {item.id}. {item.titreCarte} <div className="min"> - non disponible !!! -</div>  
                    </h1>
                  }
                </div>
                <img className="frame" src="src/data/framelow.png" alt="framelow"/>
              </Accordion.Toggle>
            </Card.Header>
            
            <Accordion.Collapse eventKey={item.id} style={{display: readable[item.id] ? '' : 'none' }}>
              <Card.Body>
              <h2 className="titreaccord">
                  {item.titreAccord}
                </h2>
                <ListGroup>
                  {item.liste.map((element, i) => (
                    <ListGroup.Item key={i}>
                      {element}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}

      </Accordion>

    </div>

  </Container>
}