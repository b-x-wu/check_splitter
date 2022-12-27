import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.post('/api/split', (req, res) => {
    // req.body is a Check object (see ../README.md)

    const multiplier = (1 + req.body.tip) * (1 + req.body.tax)
    
    // create a map from ids to diners and set the owes field to 0
    const idToDiner = new Map(
        req.body.diners.map((diner) => {
            diner.owes = 0;
            diner.items = [];
            return [diner.id, diner];
        })
    );

    // for each item
    for (const item of req.body.items) {
        // calculate the cost of the item for each diner responsible
        const priceAfterSplit = (item.price * multiplier) / item.dinerIds.length;

        // for each responsible diner's id
        for (const dinerId of item.dinerIds) {
            // get the diner associated with the id in the map
            const diner = idToDiner.get(dinerId);

            if (diner === undefined) {
                res.status(500);
                res.json({
                    status: 'error',
                    message: 'Unknown diner ID found in items array.',
                });
                return;
            }

            // add the amount they are responsible for from this item
            diner.owes += priceAfterSplit;
            diner.items.push(item);
        };
    };
    
    // return the values from the map as an array of diners
    res.json({
        status: 'success',
        data: {
            diners: Array.from(idToDiner.values()),
        },
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

