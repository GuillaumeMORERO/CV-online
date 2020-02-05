import React, { useState } from 'react';

import ClassNames from 'classnames';

import { useDispatch, useSelector } from 'react-redux';

import { Container,Accordion, Card, Button, ListGroup, Modal } from 'react-bootstrap';

import './style.scss';

import { chargePirate } from 'src/store/player/actions';
import { displayContactModal } from 'src/store/contact/actions';

export default ({ pirates }) => {

  const player = useSelector(state => state.player);
  const { contactShow } = useSelector(state => state.contact);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    dispatch(chargePirate(pirates[e]));
    handleClose();
  };
  const contactModalDiplayer = () => {
    dispatch(displayContactModal());
  };

  const activeClass = ClassNames( 
    'mainContainer',
    {
      blured: show || contactShow
    }
  );

  return <Container
    fluid
    className={activeClass}
    style={{display: player.choosen ? 'none' : '' }}

  >

    <div className="disclaimer">
      <h1 className="disclaimer-1">Bienvenue Sur le CV de Guillaume MORERO !!</h1>
      <h2 className="disclaimer-2">Sur ce Cv, va y avoir de quoi faire !</h2>
      <h2 className="disclaimer-2">Tout un tas d'exploits t'attendent ici, et faudra être digne de ton avatar super zélé, et mériter de lire les différentes sections ! </h2>
      <h2 className="disclaimer-2">Et pour ce faire, il va te falloir être mal accompagné :</h2>
    </div>

    <div className="choix">
      <div className="choix-cadre">
        <img className="choix-arrow_left see" src="src/data/bluearrow.png" alt="arrow"/>
        <button type="button" className="launchers-bot" onClick={handleShow}>Choisis ton Pirate !</button>
        <img className="choix-arrow_right see" src="src/data/bluearrow.png" alt="arrow"/>
      </div>
    </div>

    <div className="choix">
      <div className="choix-cadre">
        <img className="choix-arrow_left see" src="src/data/bluearrow.png" alt="arrow"/>
        <button
          type="button"
          onClick={() => { contactModalDiplayer()} }
          className="launchers-bot"
        >Contacte moi !
        </button>
        <img className="choix-arrow_right see" src="src/data/bluearrow.png" alt="arrow"/>
      </div>
    </div>




    <Accordion defaultActiveKey="1" bsPrefix="accordion-rules">

      <Card >

        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            <img className="frame" src="src/data/framehigh.png" alt="framehigh"/>
            <div className="x">
              <h1
                className="teteAccordion"
                id="titrerules"
                >
                Voici les Régles.... Car oui, il en faut même ici !
              </h1>
            </div>
            <img className="frame" src="src/data/framelow.png" alt="framelow"/>
          </Accordion.Toggle>
        </Card.Header>
        
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <h2 className="teteAccordion" id="titrerules">
              Voici une liste simple des bonnes conduites à tenir :
            </h2>
            <ListGroup>
              
              <ListGroup.Item className="listRule">Choisis bien ton Pirate : il sont proposés par ordre décroissant de difficulté.</ListGroup.Item>
              <ListGroup.Item>Outre son nom et sa description, un pirate est défini par son Habileté et son Blindage.</ListGroup.Item>
              <ListGroup.Item>Les combats sont résolus de la maniére suivantes : chaque bélligérant fait un jet avec autant de dés que son Habileté. Le résultat de l'ennemi est soustrait à ton résultat : nombre positif = ce que tu infliges à l'adversaire ! Nombre négatif : Ce que ton Blindage subit.</ListGroup.Item>
              <ListGroup.Item>En cas de succés, tu gagnes un nombre de points de victoire qui dépend de l'adversaire.</ListGroup.Item>
              <ListGroup.Item>Et grâce à ces points de victoires, tu pourra débloquer des sections du CV pour en apprendre plus sur le génie à l'origine de ce site !!</ListGroup.Item>
             
            </ListGroup>
          </Card.Body>
        </Accordion.Collapse>

      </Card>

    </Accordion>


    




    <>

      <Modal
        show={show}
        onHide={handleClose}
        centered size="lg"
        className="select"
      >

        <div className="selectdrop">
          
          <Modal.Header>
            <Modal.Title className="selectdrop-txt">Choisis ton Pirate !!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="pirates">
              {pirates.map((pirate) => (
                <Card className="carte" key={pirate.id}>
                  <div className="carte-toop">
                    <Card.Img className="carte-toop_avatar" variant="top" src={pirate.avatar} />
                    <Card.Body className="carte-toop_caracteristic">
                      <Card.Title className="carte-toop_caracteristic-titre"> {pirate.name} </Card.Title>
                      <ListGroup className="carte-toop_caracteristic-liste">
                        <ListGroup.Item><Card.Text>Habileté : <span>{pirate.skill}</span></Card.Text></ListGroup.Item>
                        <ListGroup.Item><Card.Text>Blindage : <span>{pirate.blindage}</span></Card.Text></ListGroup.Item>
                        <ListGroup.Item><Card.Text>{pirate.descr}</Card.Text></ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </div>
                  <button
                    type="button"
                    className="launchers-bot"
                    variant="primary"
                    onClick={() => onSubmit(pirate.id)}
                  >
                    Je choisis celui-la !
                  </button>
                </Card>
              ))}
            </div>
          </Modal.Body>
        </div>
      </Modal>
    </>

  </Container>
}