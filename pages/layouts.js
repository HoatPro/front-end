import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import { Button, Input, Header, Grid, Segment, Checkbox, Modal, Label, Dropdown, Icon  } from 'semantic-ui-react';
import DashboardLayout from '../src/components/Layout/DashboadLayout';
import Head from 'next/head';
import Router from 'next/router';
import { connect } from 'react-redux';
import {layoutA} from '../src/redux/_actions/layoutA';
import {rackA} from '../src/redux/_actions/categories/rackA';
import _ from 'lodash';
import moment from 'moment';
import defaultImage from '../static/images/default_image.png';
import 'react-contexify/dist/ReactContexify.min.css';
import { Menu, Item, contextMenu } from 'react-contexify';
import { Layer,
    Rect,
    Stage,
    Image,
    Transformer
} from 'react-konva';

class DrawRect extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
    }

    handleChange (e) {
        const shape = e.target;
        // take a look into width and height properties
        // by default Transformer will change scaleX and scaleY
        // while transforming
        // so we need to adjust that properties to width and height
        this.props.onTransform({
            x: shape.x(),
            y: shape.y(),
            width: shape.width() * shape.scaleX(),
            height: shape.height() * shape.scaleY(),
            rotation: shape.rotation()
        });
    };

    handleContextMenu(e) {
        const {menuSetting} = this.props;
        const evt = e.evt;
        if((evt.which === 3 || evt.button === 2) && e.target.getAttr('name') !== 'zone') {
            evt.preventDefault();
            menuSetting(e);
            evt.stopPropagation();
            return false;
        }
    }

    render() {
        const {
            x,
            y,
            width,
            height,
            id,
            stroke,
            name,
            draggable,
            strokeWidth
        } = this.props;
        return (
            <Rect
                x={x}
                y={y}
                id={id? id: ''}
                width={width}
                height={height}
                name={name}
                scaleX={1}
                scaleY={1}
                stroke={stroke? stroke: 'red'}
                strokeWidth={strokeWidth? strokeWidth : 1}
                onDragEnd={this.handleChange}
                onTransformEnd={this.handleChange}
                draggable={draggable}
                onContextMenu={this.handleContextMenu}
            />
        );
    }
}

DrawRect.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    color: PropTypes.string
};

class DrawImage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            x,
            y,
            image,
            name,
            url
        } = this.props;
        return (
            <Image
                x={x}
                y={y}
                name={name}
                image={image}
                draggable={false}
            />
        );
    }
}

DrawImage.defaultProps = {
    draggable: true,
    image: null,
};

DrawImage.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    draggable: PropTypes.bool.isRequired,
    // image: PropTypes.object.isRequired,
};

class TransformerComponent extends Component {
    componentDidMount() {
        this.checkNode();
    }
    componentDidUpdate() {
        this.checkNode();
    }
    checkNode() {
        // here we need to manually attach or detach Transformer node
        const stage = this.transformer.getStage();
        const { selectedShapeName } = this.props;

        const selectedNode = stage.findOne('.' + selectedShapeName);
        // do nothing if selected node is already attached
        if (selectedNode === this.transformer.node()) {
            return;
        }

        if (selectedNode) {
            // attach to another node
            this.transformer.attachTo(selectedNode);
        } else {
            // remove transformer
            this.transformer.detach();
        }
        this.transformer.getLayer().batchDraw();
    }
    render() {
        return (
            <Transformer
                ref={node => {
                    this.transformer = node;
                }}
            />
        );
    }
}

class CustomMenu extends Component {
    render() {
        const {handleEditRackInfo, handleDeleteRack, handleViewRack, action} = this.props;
        if(action === 'insert') {
            return <Menu id='ctmRack'>
                <Item onClick={handleEditRackInfo}><Icon name='plus' /> Add rack info</Item>
                <Item onClick={handleDeleteRack}><Icon name='remove' /> Remove rack</Item>
            </Menu>
        } else {
            return <Menu id='ctmRack'>
                <Item onClick={handleEditRackInfo}><Icon name='pencil' /> Edit rack info</Item>
                <Item onClick={handleViewRack}><Icon name='search' /> View rack</Item>
                <Item onClick={handleDeleteRack}><Icon name='remove' /> Remove rack</Item>
            </Menu>
        }
    }
}

CustomMenu.defaultProps = {
    handleEditRackInfo: () => {},
    handleDeleteRack: () => {},
    handleViewRack: () => {},
    action: 'insert'
}

CustomMenu.propTypes = {
    handleEditRackInfo: PropTypes.func,
    handleDeleteRack: PropTypes.func,
    handleViewRack: PropTypes.func,
    action: PropTypes.oneOf(['insert', 'update'])
}

class Layouts extends Component {

    constructor(props) {
        super(props);
        this.state = {
             timeout: null,
             drawMode: true,
             isDrawing: false,
             menuSetting: null
        }
    }

    componentDidMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        const {layouts = {}, racks = {}, dispatch} = nextProps;
        const _current = racks.current || {};
        const {action = '', loading = false, current = {}} = layouts;
        // if(action === 'delete' && loading && _.size(current) === 0) {
        //     dispatch(layoutA.getRackByZone({zoneId: current.zoneId}));
        // }
        if(racks.action === 'insert' && racks.loading === 2 && _current.rackId) {
            const {draw = {}} = current;
            const {shapes = []} = draw;
            const find = _.find(shapes, {name: _current.name});
            if(find && find.id === '') {
                find.id = _current.rackId;
                -
                // dispatch(layoutA.updateCurrent('current', current));
                dispatch(rackA.updateCurrent('current', {}));
            }
        }
        
    }

    getData(_search, _pagination) {
        const { layouts = {}, dispatch } = this.props;
        // const {search = {}, pagination = {}} = layouts;
        // dispatch(layoutA.getLayouts({
        //     search: _search ? _search : search,
        //     pagination: _pagination ? _pagination : pagination
        // }));
        dispatch(layoutA.getOthers());
    }

    handleDeleteRack(e) {
        const {layouts = {}, dispatch} = this.props;
        const {current = {}} = layouts;
        if(current.rackId) {
            dispatch(layoutA.deleteRackLayout({id: current.rackId}));
        } else {
            const {draw = {}} = current;
            let {shapes = []} = draw;
            const index = _.findIndex(shapes, {name: current.name});
            if(index > -1) {
                shapes.splice(index, 1);
                const data = {
                    ...current,
                    draw: {
                        ...draw,
                        shapes: shapes
                    }
                }
                dispatch(layoutA.updateCurrent('current', data));
            }
        }
    }

    handleUpdateRow(id) {
        const {layouts, dispatch} = this.props;
        const {list = []} = layouts;
        const find = _.find(list, {layoutId: id});
        if(find) {
            dispatch(layoutA.handleUpdateRow(find));
        } 
    }

    onLoad(e) {
        const {target} = e;
        const {dispatch, layouts = {}} = this.props;
        const {current = {}} = layouts;
        const {draw = {}} = current;
        const name = this.makeRandomName();
        const img = {
            x: 0,
            y: 0,
            image: target,
            type: 'image',
            name: name
        };
        const index = _.findIndex(draw.shapes, { type: 'image'});
        let shapes = [];
        if(index > -1) {
            shapes = [];
        }
        shapes.push(img);
        //push zone to background
        const shapeZone = {
            x: current.zoneX,
            y: current.zoneY,
            width: current.zoneWidth,
            height: current.zoneHeight,
            draggable: false,
            name: 'zone',
            stroke: '#0093fb',
            strokeWidth: 4
        };
        shapes.push(shapeZone);
        const data = {
            ...current,
            draw: {
                ...draw,
                stage: {
                    width: target.width,
                    height: target.height
                },
                shapes: shapes
            }
        }
        dispatch(layoutA.updateCurrent('current', data));
    }

    makeRandomName() {
        let result = '';
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++)
            result += possible.charAt(Math.floor(Math.random() * possible.length));

        return result;
    }

    handleSelect(e, data) {
        const {dispatch, layouts = {}} = this.props;
        const {name, value} = data;
        const {zones = [], rooms = [], current = {}} = layouts;
        let temp = '';
        if(name === 'zoneId') {
            const find = _.find(zones, {zoneId: value});
            // const img = new Image();
            if(find) {
                temp = {
                    zoneWidth: find.width,
                    zoneHeight: find.height,
                    zoneX: find.x,
                    zoneY: find.y,
                    zoneId: value
                }
                const img = document.createElement('img');
                img.addEventListener('load', this.onLoad.bind(this));
                img.src = `http://localhost:4000/uploads/rooms/${current.roomId}/${current.image}`;
            } else {
                temp = {
                    zoneWidth: null,
                    zoneHeight: null,
                    zoneX: null,
                    zoneY: null,
                    zoneId: ''
                }
            }
            dispatch(layoutA.updateCurrent('current', temp));
            dispatch(layoutA.getRackByZone({zoneId: value}));
        } else if(name === 'roomId') {
            const find = _.find(rooms, {roomId: value});
            if(find) {
                temp = {
                    image: find.image,
                    roomId: value,
                }
            } else {
                temp = {
                    image: '',
                    roomId: '',
                }
            }
            dispatch(layoutA.updateCurrent('current', temp));
        } else if(name === 'dataCenterId') {
            const data = {
                dataCenterId: value
            }
            dispatch(layoutA.updateCurrent('new', data));
        } else {
            dispatch(layoutA.updateCurrent(name, value));
        }
    }

    handleChecked() {
        this.setState({drawMode: !this.state.drawMode});
    }

    handleClose() {
        this.props.dispatch(zoneA.modal(false));
    }

    onDelete() {
        const {racks = {}} = this.props;
        const {current = {}} = racks;
        const id = current.rackId;
        
        if(id) this.props.dispatch(rackA.deleteRack({id: id}));
    }

    handleStageMouseDown = (e) => {

        const {drawMode = false, isDrawing = false} = this.state;
        const target = e.target;
        const evt = e.evt;
        const {dispatch, layouts = {}} = this.props;
        const {current = {}} = layouts;
        const {draw = {}} = current;
        // right click
        if(evt.which === 3 || evt.button === 2) {
            this.setState({
                selectedShapeName: '',
            });
            return;
        }
        // if(!attrs.draggable && attrs.name !== 'zone') {

        // }

        // drawing mode is false
        if (!drawMode) {
            const layer = target.getLayer();
            layer.getChildren((node) => {
                if(node.className === 'Rect') {
                    node.draggable(false);
                    return node;
                }
            });
            this.setState({
                menuSetting: null
            });
            return;
        }
        // if we are drawing a shape, a click finishes the drawing
        if (isDrawing) {
            this.setState({
                isDrawing: !isDrawing,
            });
            return;
        }

        if (target === target.getStage() || target.className === 'Image' || target.getAttr('name') === 'zone') {
            if (target.getAttr('name') === 'zone') {
                const newShapes = draw.shapes.slice();
                const name = this.makeRandomName();
                newShapes.push({
                    x: evt.layerX,
                    y: evt.layerY,
                    width: 0,
                    height: 0,
                    draggable: true,
                    name: name,
                    id: ''
                });
                
                this.setState({
                    isDrawing: true,
                    selectedShapeName: '',
                    menuSetting: null
                });
                const data = {
                    ...current,
                    draw: {
                        ...draw,
                        shapes: newShapes,
                    }
                }
                dispatch(layoutA.updateCurrent('current', data))
            } else {
                this.setState({
                    selectedShapeName: '',
                    menuSetting: null
                })
            }
            return;
        }

        // clicked on transformer - do nothing
        const clickedOnTransformer =
            target.getParent().className === 'Transformer';
        if (clickedOnTransformer) {
            return;
        }

        // find clicked rect by its name
        const name = target.name();
        const rect = draw.shapes.find(r => r.name === name);
        if (rect) {
            this.setState({
                selectedShapeName: name,
                menuSetting: null
            });
        } else {
            this.setState({
                selectedShapeName: '',
                menuSetting: null
            });
        }
    };

    handleStageMouseUp = (e) => {
        const {drawMode = false, isDrawing = false} = this.state;
        if (!drawMode) return;
        if (isDrawing) {
            this.setState({
                isDrawing: !isDrawing,
            });
            return;
        }
    };

    handleMouseMove= (e) => {
        const {drawMode = false, isDrawing = false} = this.state;
        const {dispatch, layouts = {}} = this.props;
        const {current = {}} = layouts;
        const {draw = {}} = current;

        const konva = document.getElementsByClassName('konvajs-content')[0];
        if (!drawMode) {
            konva.style.cursor = 'default';
            return;
        }

        const mouseX = e.evt.layerX;
        const mouseY = e.evt.layerY;
        konva.style.cursor = 'crosshair';
        // update the current rectangle's width and height based on the mouse position
        if (isDrawing) {
            // get the current shape (the last shape in this.state.shapes)
            const currShapeIndex = draw.shapes.length - 1;
            const currShape = draw.shapes[currShapeIndex];
            const newWidth = mouseX - currShape.x;
            const newHeight = mouseY - currShape.y;

            const newShapesList = draw.shapes.slice();
            const oldShape = newShapesList[currShapeIndex];
            newShapesList[currShapeIndex] = {
                ...oldShape,
                x: currShape.x,   // keep starting position the same
                y: currShape.y,
                width: newWidth,  // new width and height
                height: newHeight,
            };
            const data = {
                ...current,
                draw: {
                    ...draw,
                    shapes: newShapesList
                }
            }
            dispatch(layoutA.updateCurrent('current', data));
        }
    };

    handleRectChange = (index, newProps) => {
        const {dispatch, layouts = {}} = this.props;
        const {current = {}} = layouts;
        const {draw = {}} = current;
        const rectangles = draw.shapes.concat();
        rectangles[index] = {
            ...rectangles[index],
            ...newProps
        };
        const data = {
            ...current,
            draw: {
                ...draw,
                shapes: rectangles
            }
        }
        dispatch(layoutA.updateCurrent('current', data));
    };

    makeRandomName() {
        let result = '';
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++)
            result += possible.charAt(Math.floor(Math.random() * possible.length));

        return result;
    }

    menuSetting(event) {
        const {layouts = {}, dispatch} = this.props;
        const {current = {}, racks = {}} = layouts;
        // const racks = this.props.racks.items.data;
        const target = event.currentTarget;
        const evt = event.evt;
        const attrs = target.attrs;
        const id = attrs.id? attrs.id : '';
        let rack = _.find(racks, {rackId: id});
        if(_.size(rack) === 0) {
            rack = {
                rackId: '',
                model: '',
                uNumber: null,
                SNMP: '',
                maxPower: null,
                wattage: null,
                maxWeight: null,
                dataCenterId: current.dataCenterId,
                roomId: current.roomId,
                zoneId: current.zoneId,
                x: attrs.x,
                y: attrs.y,
                width: attrs.width,
                height: attrs.height,
                rackDepth: null,
                rackWidth: null,
                rackHeight: null,
                description: '',
                parentId: '',
                status: true,
                background: '',
                rackName: ''
            };
        } else {
            rack.dataCenterId = current.dataCenterId;
            rack.roomId = current.roomId;
            rack.zoneId = current.zoneId;
            delete rack.draw;
        }
        this.setState({menuSetting: evt});
        contextMenu.show({
            id: 'ctmRack',
            event: evt,
            props: {
              foo: 'bar'
            }
        });
        dispatch(layoutA.updateCurrent('current', {
            ...rack,
            name: attrs.name,
                cancel: '/layouts'
        }));
    }

    handleEditRackInfo() {
        Router.push('/categories/rack-edit');
    }

    handleViewRack() {
        const {layouts = {}, dispatch} = this.props;
        const {current = {}, racks = {}} = layouts;
        if(current.rackId) {
            Router.push('/categories/rack-view?id=' + current.rackId);
        } 
    }

    render() {
        const {layouts = {}} = this.props;
        let { 
            current = {layoutName: '', layoutId: ''}, 
            dataCenters = [], 
            _rooms = [],
            rooms = [],
            zones = [],
            _zones = [],
            open = false,
        } = layouts;
        const { drawMode, selectedShapeName = '', menuSetting } = this.state;
        const draw = current.draw || {};
        const stage = draw.stage || {};
        let shapes = draw.shapes || [];
        const _dataCenters = _.map(dataCenters, item => ({text: item.dataCenterName, value: item.dataCenterId}));
        if(current.dataCenterId && _.size(_rooms) === 0) {
            _rooms = _.filter(rooms, item => {return (current.dataCenterId === item.dataCenterId)});
        }
        _rooms = _.map(_rooms, item => ({text: item.roomName, value: item.roomId}));
        if(current.roomId && _.size(_zones) === 0) {
            _zones = _.filter(zones, item => {return (current.roomId === item.roomId)});
        }
        _zones = _.map(_zones, item => ({text: item.zoneName, value: item.zoneId}));
       
        return (
            <div>
                <Head>
                    <title>Data Center Layout</title>
                </Head>
                <DashboardLayout>
                    <Segment>
                        <Header>Data Center Layout</Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Label>Data Center</Label>
                                <Dropdown
                                    name='dataCenterId'
                                    fluid 
                                    placeholder='Select...' 
                                    search 
                                    selection
                                    clearable
                                    options={_dataCenters}
                                    onChange={this.handleSelect.bind(this)}
                                    value={current.dataCenterId}
                                />
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Label>Room</Label>
                                <Dropdown
                                    name='roomId'
                                    fluid 
                                    placeholder='Select...' 
                                    search 
                                    selection
                                    clearable
                                    options={_rooms}
                                    onChange={this.handleSelect.bind(this)}
                                    value={current.roomId}
                                />
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Label>Zone</Label>
                                <Dropdown
                                    name='zoneId'
                                    fluid 
                                    placeholder='Select...' 
                                    search 
                                    selection
                                    clearable
                                    options={_zones}
                                    onChange={this.handleSelect.bind(this)}
                                    value={current.zoneId}
                                />
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8} className='draw-mode'>
                                <Checkbox
                                    checked={drawMode}
                                    label='Draw mode'
                                    onChange={this.handleChecked.bind(this)}
                                />
                            </Grid.Column>
                            <Grid.Row>
                                <Grid.Column>
                                    <Stage
                                        width={stage.width}
                                        height={stage.height}
                                        onMouseDown={this.handleStageMouseDown}
                                        onMouseUp={this.handleStageMouseUp}
                                        onContentMouseMove={this.handleMouseMove}
                                    >
                                        <Layer ref='layer'>
                                            { _.size(shapes) === 0 ? null : shapes.map((shape, index) => {
                                                if(shape.type === 'image') {
                                                    return (
                                                        <DrawImage
                                                            key={index}
                                                            {...shape}
                                                        />
                                                    )
                                                } else {
                                                    return (
                                                        <DrawRect
                                                            key={index}
                                                            {...shape}
                                                            isDrawingMode={drawMode}
                                                            menuSetting={this.menuSetting.bind(this)}
                                                            onTransform={newProps => {
                                                                this.handleRectChange(index, newProps);
                                                            }}
                                                            // pass isDrawingMode so we know when we can click on a shape
                                                        />
                                                    );
                                                }
                                            })}
                                            <TransformerComponent
                                                selectedShapeName={selectedShapeName}
                                            />
                                        </Layer>
                                    </Stage>
                                    {menuSetting || null? 
                                        <CustomMenu
                                            handleEditRackInfo={this.handleEditRackInfo.bind(this)}
                                            handleDeleteRack={this.handleDeleteRack.bind(this)}
                                            handleViewRack={this.handleViewRack.bind(this)}
                                            action={current.rackId? 'update': 'insert'}
                                        /> : ''
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Modal size={'mini'} open={open} 
                            onClose={this.handleClose.bind(this)}
                            closeOnEscape={true}
                            closeOnDimmerClick={false}
                        >
                            <Modal.Header>Remove Layout</Modal.Header>
                            <Modal.Content>
                                <p>Do you want to remove the Rack: {`"${current.rackName}"`} ?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.handleClose.bind(this)}>Cancel</Button>
                                <Button positive icon='checkmark' labelPosition='right' content='Yes' onClick={this.onDelete.bind(this)} />
                            </Modal.Actions>
                        </Modal>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({ layouts, racks }) => ({ layouts, racks });

export default connect(mapStateToProps, null)(Layouts);