import React, { useState, useEffect } from 'react';
import * as eventService from '../../services/eventService';
import * as lookUpService from '../../services/lookupService';
import Pagination from 'rc-pagination';
import locale from 'rc-pagination/lib/locale/en_US';
import 'rc-pagination/assets/index.css';
import debug from 'sabio-debug';
import { Row, Col, Form, Stack } from 'react-bootstrap';
import EventCard from './EventCard';
import toastr from 'toastr';
import { useLocation } from 'react-router-dom';
import { authProtectedFlattenRoutes } from '../../routes';
import usersServices from '../../services/usersServices';
import { Link } from 'react-router-dom';

const _logger = debug.extend('EventPage');

function Events(props) {
    const [eventsData, setEventsData] = useState({
        arrayOfEvents: [],
        eventComponents: [],
        eventTypes: [],
        eventCategories: '',
        eventTypesMapped: [],
        totalCount: 0,
    });

    const [isCreator, setIsCreator] = useState(false);

    const DEFAULT_USER = {
        id: 0,
        roles: [],
        email: '',
        isLoggedIn: false,
    };

    let [currentUser, setCurrentUser] = useState(() => {
        return DEFAULT_USER;
    });

    const [search, setSearchQuery] = useState('');
    const [pageInfo, updatePageInfo] = useState({
        index: 1,
        size: 8,
    });
    const { pathname } = useLocation();

    const [currentPath, setCurrentPath] = useState({
        isPublic: false,
        isSecured: false,
        isUnknown: false,
    });

    useEffect(() => {
        if (authProtectedFlattenRoutes.some((pp) => currentPathCheck(pp))) {
            if (!currentPath.isSecured) {
                setCurrentPath(() => {
                    return { isPublic: false, isSecured: true };
                });
            }
        } else if (!currentPath.isUnknown) {
            setCurrentPath(() => {
                return { isUnknown: true };
            });
        }
    }, [pathname, currentPath]);

    useEffect(() => {
        usersServices.getCurrent().then(onGetCurrentSuccess).catch(onGetCurrentFail);
    }, []);

    const onGetCurrentSuccess = (res) => {
        const userData = res.data.item;
        _logger(res.data.item);
        setCurrentUser({
            id: userData.id,
            roles: userData.roles,
            email: userData.name,
            isLoggedIn: true,
        });
    };

    const onGetCurrentFail = (err) => {
        _logger(err);
    };

    const currentPathCheck = (pp) => {
        let ppPath = pp.path.split('/').filter((el) => el !== '');
        let pathNameCheck = pathname.split('/').filter((el) => el !== '');
        let result = false;
        _logger('ppPath: ', ppPath, 'pathNameCheck: ', pathNameCheck);
        if (ppPath.length === pathNameCheck.length) {
            if (pathNameCheck.length === 0) {
                result = true;
            } else {
                for (let a = 0; a < pathNameCheck.length; a++) {
                    if (pathNameCheck[a] !== ppPath[a]) {
                        if (ppPath[a].startsWith(':') && pathNameCheck[a].match(/^[0-9]+$/)) {
                            result = true;
                        } else {
                            return false;
                        }
                    } else {
                        result = true;
                    }
                }
            }
        }
        return result;
    };

    useEffect(() => {
        if (search.length > 0) {
            eventService
                .searchEvents(search, pageInfo.index - 1, pageInfo.size)
                .then(onGetEventsSuccess)
                .catch(onGetEventsError);
        } else {
            eventService
                .getEvents(pageInfo.index - 1, pageInfo.size)
                .then(onGetEventsSuccess)
                .catch(onGetEventsError);
        }
    }, [pageInfo.index, search]);

    useEffect(() => {
        _logger('Rendered EventTypes');
        let payload = ['EventTypes'];
        lookUpService.getTypes(payload).then(onGetLookupSuccess).catch(onGetLookupError);
    }, []);

    const onGetLookupSuccess = (response) => {
        _logger('onGetEventLookupSuccess', response);
        setEventsData((prevState) => {
            let pd = { ...prevState };
            pd.eventTypes = response.item.eventTypes;
            pd.eventTypesMapped = response.item.eventTypes.map(mapEventTypes);
            return pd;
        });
    };

    const onGetLookupError = (err) => {
        toastr.error('onSearchEventCategoriesError', err);
    };

    const mapEventTypes = (eventType) => {
        return (
            <option value={eventType.id} key={`eventType_${eventType.id}`}>
                {eventType.name}
            </option>
        );
    };

    const onGetEventsSuccess = (response) => {
        _logger('onGetEventsSuccess', response);
        const arrayOfEvents = response.item.pagedItems;
        setEventsData((prevState) => {
            let pd = { ...prevState };
            pd.arrayOfEvents = arrayOfEvents;
            pd.eventComponents = arrayOfEvents.map(mapEvents);
            pd.totalCount = response.item.totalCount;

            return pd;
        });
    };

    const onGetEventsError = (err) => {
        toastr.error('onGetEventsError', err);
    };

    const mapEvents = (aEvent) => {
        if (aEvent.createdBy === currentUser) {
            setIsCreator(true);
        }
        return (
            <Link
                to={`/events/${aEvent.id}`}
                state={{ type: 'EVENT_VIEW', payload: aEvent }}
                key={`aEventCard_${aEvent.id}`}>
                <EventCard aEvent={aEvent} currentPath={currentPath} isCreator={isCreator} {...props} />
            </Link>
        );
    };
    const filterEventsByType = (e) => {
        const { value } = e.target;
        if (value !== '0') {
            const filterEventsWorkshop = eventsData.arrayOfEvents.filter(
                (evtType) => evtType.eventTypes.id === Number(value)
            );
            setEventsData((prevState) => {
                let pd = { ...prevState };
                pd.eventComponents = filterEventsWorkshop.map(mapEvents);
                return pd;
            });
        } else {
            const filterEventsWorkshop = eventsData.arrayOfEvents;
            setEventsData((prevState) => {
                let pd = { ...prevState };
                pd.eventComponents = filterEventsWorkshop.map(mapEvents);
                return pd;
            });
        }
    };

    //pageChange
    const onChange = (page) => {
        _logger(page, 'page');
        updatePageInfo((prevState) => {
            const pageInfo = { ...prevState };
            pageInfo.index = page;
            return pageInfo;
        });
    };

    //handleChange
    const handleChange = (e) => {
        const { value } = e.target;
        setSearchQuery(() => {
            return value;
        });
        updatePageInfo((prevState) => {
            const pageInfo = { ...prevState };
            pageInfo.index = 1; // -1 0
            return pageInfo;
        });
    };

    return (
        <React.Fragment>
            <div className="container">
                <Row
                    style={{
                        paddingTop: '50px',
                        boxSizing: 'content-box',
                    }}
                    containerstyle={{
                        position: 'relative',
                        overflow: 'visible',
                    }}
                    className="mb-3 mx-auto padding-40%A">
                    <h2>EVENTS</h2>
                    <Col sm={4}>
                        <Pagination
                            className="mb-3 mx-auto"
                            current={pageInfo.index}
                            total={eventsData.totalCount}
                            pageSize={pageInfo.size}
                            onChange={onChange}
                            locale={locale}></Pagination>
                    </Col>
                    <Col sm={4}>
                        <select className="form-control" onChange={filterEventsByType}>
                            <option value="0"> All</option>
                            {eventsData.eventTypesMapped}
                        </select>
                    </Col>
                    <Col>
                        <Row>
                            <Col className="end-fields">
                                <Form className="mb-3 mx-auto float-end">
                                    <Stack direction="horizontal" gap={0}>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="search"
                                            placeholder="Search Events"
                                            onChange={handleChange}
                                        />
                                    </Stack>
                                </Form>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="my-2" md={3} xxl={3}>
                    {eventsData.eventComponents}
                </Row>
            </div>
        </React.Fragment>
    );
}

export default Events;
