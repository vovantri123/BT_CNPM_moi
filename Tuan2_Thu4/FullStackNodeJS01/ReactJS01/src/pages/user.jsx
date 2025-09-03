import { notification, Table } from "antd";
import { useEffect, useState } from "react";
import { getUserApi } from "../services/api";

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    
    const fetchUser = async () => {
        setLoading(true);
        const res = await getUserApi(current, pageSize);
        if (!res?.message) {
            setDataSource(res?.result ?? []);
            setTotal(res?.meta?.total ?? 0);
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
        setLoading(false);
    }
    
    useEffect(() => {
        fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current, pageSize]);

    const onChange = (pagination) => {
        if (pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
        }
    };
    
    const columns = [
        {
            title: 'STT',
            render: (_, record, index) => {
                //record → object dữ liệu của row hiện tại
                // index → vị trí của bản ghi trong dataSource hiện tại, bắt đầu từ 0
                return (
                    <>{(current - 1) * pageSize + index + 1}</>
                )
            }
        },
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
    ];
    
    return (
        <div style={{ padding: 30 }}>
            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                rowKey={"_id"}
                loading={loading}
                pagination={{
                    current: current,
                    pageSize: pageSize,
                    showSizeChanger: true, // bật dropdown chỉnh số row trên mỗi page
                    pageSizeOptions: ['3','5','10', '20'], // thêm các option bạn muốn
                    total: total,
                    showTotal: (total, range) => {
                        return (<div> {range[0]}-{range[1]} trên {total} rows</div>)
                    }
                }}
                onChange={onChange}
            />
        </div>
    )
}

export default UserPage;