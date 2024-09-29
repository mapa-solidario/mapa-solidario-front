import React, { useEffect, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import Swal from 'sweetalert2';
import { Button, Form, InputGroup, Spinner, Table } from 'react-bootstrap';

import { BsPencil } from "react-icons/bs";
import { IoReload } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";

import styles from './index.module.scss';
import useRoles from 'hooks/useRoles.hook';
import useAllUsers from 'hooks/useAllUsers.hook';

import { Interface as InterfaceRole } from 'store/app/rol';
import InterfaceUser from 'store/app/allUsers/allUsers.redux';

import UserCreateComponent from '../../../modules/manageUsers/create/user.create.component';
import HeaderTurnBackComponent from 'components/header_turn_back/header_turn_back.component';

const ManageUsersPage: React.FC = () => {
	const { roles } = useRoles()
	const { all_users: users, getAll } = useAllUsers()

	const [userData, setUserData] = useState<Partial<InterfaceUser>>({})
	const [rol, setRol] = useState<Partial<InterfaceRole>>({})
	const [show, setShow] = useState<boolean>(false)


	useEffect(() => {
		if (!show) setUserData({})
	}, [show])


	return (
		<div className={styles.main}>

			{/* start Titulo */}
			<HeaderTurnBackComponent title="Gestiona los usuarios" />
			{/* end Titulo */}


			{/* start Acciones crear ingresar */}
			<div className='d-flex justify-content-between flex-wrap mb-5'>
				<Fade>
					<InputGroup className="mb-3">
						{roles?.length ?

							<Form.Select className={styles.input_group_text} aria-label="Default select example" onChange={e => setRol(roles.find(item => item._id === e?.target?.value) || {})}>
								<option value="">Selecciona un rol</option>
								<option value="">Todos</option>
								{roles?.map((item: InterfaceRole) => (
									<option key={item._id} value={item._id}>{item.name}</option>
								))}
							</Form.Select>
							: <Spinner animation="grow" />
						}
					</InputGroup>
				</Fade>

				<Fade>
					<Button variant="outline-primary" onClick={getAll}>
						Recargar usuarios <IoReload />
					</Button>
				</Fade>

				<Fade>
					<UserCreateComponent setShow={setShow} show={show} userData={userData} />
				</Fade>

			</div>
			{/* end Acciones crear ingresar */}


			{/* start listar los hogares del usuario */}
			<Fade>
				{users?.length ? <Table striped hover borderless>
					<thead>
						<tr>
							<th>ID</th>
							<th>nombre</th>
							<th>celular</th>
							<th>roles</th>
							<th style={{ width: '100px' }} >acciones</th>
						</tr>
					</thead>
					<tbody>
						{roles?.length && users?.filter(r => rol?._id ? r.roles?.includes(rol._id) : true).map(r => (<tr key={r?._id}>
							<td>{r.incremental}</td>
							<td>{r.name}</td>
							<td style={{ backgroundColor: !r?.cell_phone?.trim() ? '#ff00009e' : '' }}>{r?.cell_phone}</td>
							<td>{r.roles?.map((item: string) => roles.find(rol => rol._id === item)?.name).join(', ')}</td>
							<td>
								<div className='d-flex justify-content-center gap-3'>
									<FaRegEye style={{ cursor: 'pointer' }} title='Ver' onClick={() => Swal.fire(
										'Usuario ' + r?.incremental,
										`<p><b>Nombre:</b> ${r?.name}</p>
										<p><b>Correo:</b>  ${r?.email}</p>
										<p><b>Cedula:</b>  ${r?.nit}</p>
										<p><b>Celular:</b>  ${r?.cell_phone || ''}</p>
										<p><b>Roles:</b>  ${r?.roles?.map((item: string) => roles.find(rol => rol._id === item)?.name).join(', ')}</p>`
									)} />
									<BsPencil style={{ cursor: 'pointer' }} title='Editar' onClick={() => { setUserData(r); setShow(true) }} />
								</div>
							</td>
						</tr>))}
					</tbody>
				</Table>
					: <Spinner animation="grow" />
				}

			</Fade>
			{/* end listar los hogares del usuario */}
		</div>
	)
}

export default ManageUsersPage