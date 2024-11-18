import '../styles/workers/workers.css'
import { Add } from 'iconsax-react'
import { Text, Divider } from '@mantine/core'
import ButtonComponent from '../components/ButtonComponent'
import { useData } from '../context/DataProvider'

import WorkersTable from '../components/tables/WorkersTable'
import { useDisclosure } from '@mantine/hooks'

import AddWorker from '../components/modals/AddWorker'

export default function Workers() {
    const { teamMembers, jobs } = useData();
    const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false);


    return (
        <div className="workers-container">
            <section className="main-title-cta">
                <div
                    className="main-title-section"
                    style={{
                        padding: 0,
                    }}>
                    <h1 className="main-title">Ouvriers</h1>
                    <Text className="main-subtitle" c="dimmed">Liste des ouvriers</Text>
                </div>
                <div className="add-worker-section">
                    <div>
                        <ButtonComponent
                            fieldname={'Ajouter un ouvrier'}
                            rightIcon={<Add size={24} />}
                            onClick={addOpen}
                        />
                    </div>
                </div>
            </section>
            <Divider className="divider" />

            <section className="workers-list-section">
                <div className="workers-datagrid">
                    <WorkersTable
                        teamMembers={teamMembers}
                        jobs={jobs}
                    />
                </div>
            </section>
            <AddWorker
                addOpened={addOpened}
                addClose={addClose}
                jobs={jobs}
            />
        </div>
    )
}