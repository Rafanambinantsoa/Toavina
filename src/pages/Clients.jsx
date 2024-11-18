import { SearchIcon } from "lucide-react"
import { Add } from "iconsax-react"

import { Divider, Text } from "@mantine/core"

import TextInputComponent from "../components/TextInput"
import ButtonComponent from "../components/ButtonComponent"
import ClientTable from "../components/tables/ClientTable"
import AddClient from "../components/modals/AddClient"

import { useDisclosure } from "@mantine/hooks"
import { useState, useMemo } from "react"
import { useData } from "../context/DataProvider"

import '../styles/clients/clients.css'


export default function Clients() {
    const [opened, { open, close }] = useDisclosure(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false);

    // Access context data
    const { projectData, clientData } = useData();

    // Filter clients based on search query
    const filteredClients = useMemo(() => {
        return clientData.filter(client =>
            client.nom_client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.contact_client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.created_at.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [clientData, searchQuery]);

    const handleSearchChange = (value) => {
        setSearchQuery(value.toString());
    };

    return (
        <div className="clients-container">
            <section className="main-title-cta">
                <div
                    className="main-title-section"
                    style={{
                        padding: 0,
                        marginBottom: 24
                    }}>
                    <h1 className="main-title">Clients</h1>
                    <Text className="main-subtitle" c="dimmed">Liste des clients</Text>
                </div>
                <div className="add-client-section">
                    <div>
                        <ButtonComponent
                            fieldname={'Ajouter un client'}
                            rightIcon={<Add size={24} />}
                            onClick={addOpen}
                        />
                    </div>
                </div>
            </section>
            <Divider className="divider" />

            <section className="clients-list-section">
                <div className="clients-datagrid">
                    <ClientTable
                        clientData={filteredClients}
                    />
                </div>
            </section>



            <AddClient
                addOpened={addOpened}
                addClose={addClose}
            />
        </div>

    )
}