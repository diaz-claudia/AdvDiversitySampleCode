import { React } from 'react';
import { Card } from 'react-bootstrap';
import debug from 'sabio-debug';
import * as wizardPropTypes from './eventWizardPropTypes';
import { useNavigate } from 'react-router-dom';
// import { format } from 'date-fns';
import './events.css';
import editIcon from '../../assets/images/surveys/edit.svg';
import informationIcon from '../../assets/images/surveys/information.svg';

const EventCard = (props) => {
    const _logger = debug.extend('EventCard');
    const navigate = useNavigate();

    const eventData = props.aEvent;
    const currPath = props.currentPath;
    const creator = props.isCreator;
    _logger(eventData, currPath, creator, props);

    const dateTimeStart = eventData?.dateStart;
    // const dateTimeEnd = eventData.dateEnd;
    const dateEvent = dateTimeStart;
    // const dateEvent2 = format(new Date(dateTimeEnd), 'Pp');

    const handleClick = () => {
        const state = { type: 'EVENT_VIEW', payload: eventData };
        navigate(`/events/${eventData?.id}`, { state });
    };

    const onEditButtonClicked = () => {
        const eventFormToSend = { type: 'EDIT_VIEW', payload: eventData };
        navigate(`/dashboard/events/${eventData?.id}/edit`, { eventFormToSend });
    };

    return (
        <Card className="text-center">
            <Card.Body className="event-card">
                <img src={eventData?.imageUrl} className="rounded img-fluid mx-auto card-img-top " alt="" />
                <div className=" ">
                    {' '}
                    {eventData?.isFree && <div className="badge bg-success text-end">Free Event!</div>}
                    {eventData?.eventTypes && (
                        <div className="badge bg-warning text-start">{eventData?.eventTypes.name}</div>
                    )}
                </div>
                <h3 className="text-truncate">{eventData?.eventName}</h3>
                <h4 className=" text-truncate">{eventData?.shortDescription}</h4>

                <div className=" mt-3">
                    <span className=" font-13">
                        <h5>{dateEvent}</h5>
                    </span>
                    <p className=" font-13">
                        <span className="ms-2 ">
                            {eventData?.venue.venueName}, {eventData?.venue.location.city}
                        </span>
                    </p>
                </div>
                <div className="text-center">
                    <button type="button" className="btn" onClick={handleClick}>
                        <img src={informationIcon} alt="info i" width="20"></img>
                    </button>
                    <div className="">
                        {' '}
                        {eventData?.isCreator && (
                            <button type="button" className="btn" onClick={onEditButtonClicked}>
                                <img src={editIcon} alt="edit icon" width="20" />
                            </button>
                        )}
                        &nbsp;
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};
export default EventCard;
EventCard.propTypes = wizardPropTypes.eventWizardPropTypes;
