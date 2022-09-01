import React, { useEffect } from 'react';
import { withFormik } from 'formik';
import { Row, Card, Form, Col } from 'react-bootstrap';
import { eventBaseSchema } from '../../schema/eventFormSchema';
import * as wizardPropTypes from './eventWizardPropTypes';
import toastr from 'toastr';
import 'toastr/build/toastr.css';

import FileUploader from '../files/FileUploader';
import debug from 'sabio-debug';
const _logger = debug.extend('events');
const _loggerBaseForm = _logger.extend('eventBaseForm');
const EventBaseForm = (props) => {
    const { values, errors, touched, handleChange, handleBlur, handleSubmit, nextLabel, onNext, setFieldValue } = props;

    useEffect(() => {
        props.onChange(values);
    }, [values]);

    const onNextClicked = () => {
        onNext(values);
    };

    const checkCurrentErrors = () => {
        return false;
    };
    const handleUpload = (urlList) => {
        _loggerBaseForm(urlList);
        _loggerBaseForm(urlList[0].url);

        const imageUrl = urlList[0].url;
        setFieldValue('imageUrl', imageUrl);
        toastr['success']('File added.');
    };

    return (
        <Form onSubmit={handleSubmit} className="p-1">
            <Card className="p-4 mb-4">
                <Card.Header>
                    <h2 className="text-center">Event Creation</h2>
                </Card.Header>
                <div className="text-center ">
                    <h4 className="text-dark-50 text-center mt-2 fw-bold">Please fill in event information below:</h4>
                    <p className="text-muted mb-4"></p>
                </div>
                <div className="form-group">
                    <label htmlFor="eventName">Event Name</label>
                    <div className="form-group my-3">
                        <Form.Control
                            name="eventName"
                            id="eventName"
                            value={values.eventName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            placeholder="Enter event name"
                            className="form-control"
                        />
                        {errors.eventName && touched.eventName && (
                            <div id="feedback" style={{ color: 'red' }}>
                                {errors.eventName}
                            </div>
                        )}
                    </div>

                    <label htmlFor="summary">Summary of your event</label>
                    <div className="form-group my-3">
                        <Form.Control
                            name="summary"
                            id="summary"
                            value={values.summary}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            placeholder="Enter a summary of your event"
                            className="form-control"
                        />
                        {errors.summary && touched.summary && (
                            <div id="feedback" style={{ color: 'red' }}>
                                {errors.summary}
                            </div>
                        )}
                    </div>

                    <label htmlFor="shortDescription">Short Description of your event</label>
                    <div className="form-group my-3">
                        <Form.Control
                            name="shortDescription"
                            id="shortDescription"
                            value={values.shortDescription}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            placeholder="Enter a short description of your event"
                            className="form-control"
                        />
                        {errors.shortDescription && touched.shortDescription && (
                            <div id="feedback" style={{ color: 'red' }}>
                                {errors.shortDescription}
                            </div>
                        )}
                    </div>

                    <label htmlFor="imageUrl">Banner image for your event</label>
                    <div className="form-group my-3">
                        <FileUploader onHandleUploadSuccess={handleUpload} isMultilple={false} />
                        {errors.imageUrl && touched.imageUrl && (
                            <div id="feedback" style={{ color: 'red' }}>
                                {errors.imageUrl}
                            </div>
                        )}
                    </div>

                    <label htmlFor="isFree">Is your event Free?</label>
                    <div className="form-group my-3">
                        <Form.Select
                            name="isFree"
                            id="isFree"
                            value={values.isFree}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined">
                            <option> Please select an option</option>
                            <option value="true">Free event</option>
                            <option value="false">Paid event</option>
                        </Form.Select>
                        {errors.isFree && touched.isFree && (
                            <div id="feedback" style={{ color: 'red' }}>
                                {errors.isFree}
                            </div>
                        )}
                    </div>

                    <label htmlFor="dateStart">When does your event start? </label>
                    <div className="form-group my-3">
                        <Form.Control
                            name="dateStart"
                            id="dateStart"
                            type="datetime-local"
                            value={values.dateStart}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            placeholder="Please enter date and time"
                            className="form-control"
                        />
                        {errors.dateStart && touched.dateStart && (
                            <div id="feedback" style={{ color: 'red' }}>
                                {errors.dateStart}
                            </div>
                        )}
                    </div>

                    <label htmlFor="dateEnd">When does your event end? </label>
                    <div className="form-group my-3">
                        <Form.Control
                            name="dateEnd"
                            id="dateEnd"
                            type="datetime-local"
                            value={values.dateEnd}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            placeholder="Please enter date and time "
                            className="form-control"
                        />
                        {errors.dateEnd && touched.dateEnd && (
                            <div id="feedback" style={{ color: 'red' }}>
                                {errors.dateEnd}
                            </div>
                        )}
                    </div>

                    <label htmlFor="eventTypeId">Event Type</label>
                    <div className="form-group my-3">
                        <Form.Select
                            name="eventTypeId"
                            id="eventTypeId"
                            value={values.eventTypeId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined">
                            <option> Please select a type</option>
                            <option value="1">Workshop</option>
                            <option value="2">Meetup</option>
                            <option value="3">Career fair</option>
                            <option value="4">Panel</option>
                            <option value="5">Discussion</option>
                        </Form.Select>
                        {errors.eventTypeId && touched.eventTypeId && (
                            <div id="feedback" style={{ color: 'red' }}>
                                {errors.eventTypeId}
                            </div>
                        )}
                    </div>
                </div>

                <div className="button-group pt-3">
                    <Row className="mt-3 text-center">
                        <Col></Col>
                        <Col>
                            <button
                                type="submit"
                                className="btn btn-primary ml-2"
                                disabled={checkCurrentErrors()}
                                onClick={onNextClicked}>
                                {nextLabel}
                            </button>
                        </Col>
                    </Row>
                </div>
            </Card>
        </Form>
    );
};

EventBaseForm.propTypes = wizardPropTypes.eventWizardPropTypes;

export default withFormik({
    mapPropsToValues: (props) => ({
        eventName: props.eventData.eventName || '',
        summary: props.eventData.summary,
        shortDescription: props.eventData.shortDescription,
        imageUrl: props.eventData.imageUrl,
        isFree: props.eventData.isFree,
        dateStart: props.eventData.dateStart,
        dateEnd: props.eventData.dateEnd,
        eventTypeId: props.eventData.eventTypeId,
        eventStatusId: props.eventData.eventStatusId,
    }),

    validationSchema: eventBaseSchema,

    handleSubmit: (values, { props }) => {
        props.onNext(values);
    },
})(EventBaseForm);
